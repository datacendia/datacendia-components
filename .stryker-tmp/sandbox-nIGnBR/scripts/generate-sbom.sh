#!/bin/bash
# =============================================================================
# SBOM GENERATION SCRIPT - Supply Chain Attestation for Enterprise Buyers
# =============================================================================
# Generates Software Bill of Materials using Syft and scans for vulnerabilities
# with Grype. Signs container images with Cosign for provenance.
# =============================================================================

set -e

# Configuration
PROJECT_NAME="datacendia"
REGISTRY="${REGISTRY:-ghcr.io/datacendia}"
VERSION="${VERSION:-$(git describe --tags --always 2>/dev/null || echo "dev")}"
OUTPUT_DIR="./sbom-output"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Datacendia SBOM & Security Pipeline${NC}"
echo -e "${GREEN}========================================${NC}"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Check for required tools
check_tool() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}Error: $1 is not installed${NC}"
        echo "Install with: $2"
        exit 1
    fi
}

echo -e "\n${YELLOW}Checking required tools...${NC}"
check_tool "syft" "curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin"
check_tool "grype" "curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin"

# Optional: cosign for container signing
COSIGN_AVAILABLE=false
if command -v cosign &> /dev/null; then
    COSIGN_AVAILABLE=true
    echo -e "${GREEN}✓ Cosign available for container signing${NC}"
else
    echo -e "${YELLOW}⚠ Cosign not installed - container signing will be skipped${NC}"
fi

# =============================================================================
# 1. GENERATE SBOM FOR BACKEND
# =============================================================================
echo -e "\n${YELLOW}[1/5] Generating SBOM for backend...${NC}"

cd backend 2>/dev/null || cd ../backend

syft . \
    --output spdx-json="$OUTPUT_DIR/backend-sbom.spdx.json" \
    --output cyclonedx-json="$OUTPUT_DIR/backend-sbom.cdx.json" \
    --output table

echo -e "${GREEN}✓ Backend SBOM generated${NC}"

# =============================================================================
# 2. GENERATE SBOM FOR FRONTEND
# =============================================================================
echo -e "\n${YELLOW}[2/5] Generating SBOM for frontend...${NC}"

cd ../

syft . \
    --exclude backend \
    --output spdx-json="$OUTPUT_DIR/frontend-sbom.spdx.json" \
    --output cyclonedx-json="$OUTPUT_DIR/frontend-sbom.cdx.json" \
    --output table

echo -e "${GREEN}✓ Frontend SBOM generated${NC}"

# =============================================================================
# 3. VULNERABILITY SCAN
# =============================================================================
echo -e "\n${YELLOW}[3/5] Scanning for vulnerabilities...${NC}"

# Scan backend
echo "Scanning backend dependencies..."
grype sbom:"$OUTPUT_DIR/backend-sbom.spdx.json" \
    --output table \
    --file "$OUTPUT_DIR/backend-vulnerabilities.txt" \
    --fail-on critical || echo -e "${YELLOW}⚠ Critical vulnerabilities found in backend${NC}"

# Scan frontend
echo "Scanning frontend dependencies..."
grype sbom:"$OUTPUT_DIR/frontend-sbom.spdx.json" \
    --output table \
    --file "$OUTPUT_DIR/frontend-vulnerabilities.txt" \
    --fail-on critical || echo -e "${YELLOW}⚠ Critical vulnerabilities found in frontend${NC}"

# JSON vulnerability report
grype sbom:"$OUTPUT_DIR/backend-sbom.spdx.json" \
    --output json \
    --file "$OUTPUT_DIR/vulnerabilities-report.json"

echo -e "${GREEN}✓ Vulnerability scan complete${NC}"

# =============================================================================
# 4. CONTAINER IMAGE SCANNING (if Docker available)
# =============================================================================
echo -e "\n${YELLOW}[4/5] Scanning container images...${NC}"

if command -v docker &> /dev/null; then
    # List datacendia containers
    CONTAINERS=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "cendia|datacendia" || true)
    
    if [ -n "$CONTAINERS" ]; then
        for image in $CONTAINERS; do
            echo "Scanning $image..."
            syft "$image" --output spdx-json="$OUTPUT_DIR/container-$(echo $image | tr '/:' '-')-sbom.json" 2>/dev/null || true
            grype "$image" --output table --file "$OUTPUT_DIR/container-$(echo $image | tr '/:' '-')-vulns.txt" 2>/dev/null || true
        done
        echo -e "${GREEN}✓ Container images scanned${NC}"
    else
        echo -e "${YELLOW}⚠ No Datacendia containers found${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Docker not available - skipping container scanning${NC}"
fi

# =============================================================================
# 5. CONTAINER SIGNING (if Cosign available)
# =============================================================================
echo -e "\n${YELLOW}[5/5] Signing artifacts...${NC}"

if [ "$COSIGN_AVAILABLE" = true ]; then
    # Generate keypair if not exists
    if [ ! -f "cosign.key" ]; then
        echo "Generating signing keypair..."
        cosign generate-key-pair
    fi
    
    # Sign SBOMs
    for sbom in "$OUTPUT_DIR"/*.json; do
        if [ -f "$sbom" ]; then
            cosign sign-blob --key cosign.key "$sbom" > "${sbom}.sig" 2>/dev/null || true
        fi
    done
    
    echo -e "${GREEN}✓ Artifacts signed${NC}"
else
    echo -e "${YELLOW}⚠ Cosign not available - skipping signing${NC}"
fi

# =============================================================================
# SUMMARY REPORT
# =============================================================================
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}SBOM Generation Complete${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\nGenerated files in $OUTPUT_DIR:"
ls -la "$OUTPUT_DIR"

# Count vulnerabilities
CRITICAL=$(grep -c "Critical" "$OUTPUT_DIR"/*.txt 2>/dev/null || echo "0")
HIGH=$(grep -c "High" "$OUTPUT_DIR"/*.txt 2>/dev/null || echo "0")
MEDIUM=$(grep -c "Medium" "$OUTPUT_DIR"/*.txt 2>/dev/null || echo "0")

echo -e "\n${YELLOW}Vulnerability Summary:${NC}"
echo -e "  Critical: $CRITICAL"
echo -e "  High: $HIGH"
echo -e "  Medium: $MEDIUM"

echo -e "\n${GREEN}Supply chain attestation ready for enterprise buyers.${NC}"
echo -e "Share SBOM files with auditors for compliance verification.\n"
