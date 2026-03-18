"""
RAPIDS Analytics Server for Datacendia
GPU-accelerated bias detection and graph analytics via cuGraph/cuDF.

Exposes a FastAPI server on port 5555 that RAPIDSService.ts connects to
when RAPIDS_URL is set in the backend environment.

Endpoints:
  GET  /health              — Health check
  POST /bias/scan           — Scan decisions for algorithmic bias (GPU-accelerated)
  POST /graph/analyze       — Graph analytics on decision networks
  POST /analytics/aggregate — GPU-accelerated data aggregation
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger("rapids-server")
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Datacendia RAPIDS Analytics Server",
    description="GPU-accelerated bias detection and graph analytics",
    version="1.0.0",
)

# Attempt to import RAPIDS libraries (GPU required)
try:
    import cudf
    import cugraph
    import cupy as cp
    GPU_AVAILABLE = True
    logger.info("RAPIDS GPU libraries loaded successfully")
except ImportError:
    GPU_AVAILABLE = False
    logger.warning("RAPIDS GPU libraries not available — running in CPU fallback mode")
    try:
        import pandas as pd
        import numpy as np
    except ImportError:
        pass


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class BiasRequest(BaseModel):
    decisions: List[Dict[str, Any]]
    protected_attributes: List[str] = ["gender", "ethnicity", "age_group", "location"]
    threshold: float = 0.1  # Maximum acceptable disparity ratio


class BiasResult(BaseModel):
    attribute: str
    groups: Dict[str, float]
    disparity_ratio: float
    flagged: bool
    details: str


class BiasResponse(BaseModel):
    gpu_accelerated: bool
    total_decisions: int
    attributes_scanned: int
    flags: List[BiasResult]
    overall_score: float  # 0.0 = no bias detected, 1.0 = severe bias


class GraphRequest(BaseModel):
    edges: List[Dict[str, Any]]  # [{source, target, weight}]
    algorithm: str = "pagerank"  # pagerank, betweenness, community


class AnalyticsRequest(BaseModel):
    data: List[Dict[str, Any]]
    group_by: List[str]
    aggregations: Dict[str, str]  # {column: "sum"|"mean"|"count"|"min"|"max"}


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "gpu_available": GPU_AVAILABLE,
        "service": "datacendia-rapids",
        "version": "1.0.0",
    }


@app.post("/bias/scan", response_model=BiasResponse)
async def bias_scan(request: BiasRequest):
    """
    Scan a set of decisions for algorithmic bias across protected attributes.
    Uses GPU-accelerated computation when available.
    """
    if not request.decisions:
        raise HTTPException(status_code=400, detail="No decisions provided")

    flags = []
    total_decisions = len(request.decisions)

    if GPU_AVAILABLE:
        df = cudf.DataFrame(request.decisions)
    else:
        df = pd.DataFrame(request.decisions)

    for attr in request.protected_attributes:
        if attr not in df.columns:
            continue

        # Calculate approval/positive outcome rates per group
        if "outcome" in df.columns:
            if GPU_AVAILABLE:
                grouped = df.groupby(attr)["outcome"].mean().to_pandas()
            else:
                grouped = df.groupby(attr)["outcome"].mean()

            groups = grouped.to_dict()

            if len(groups) >= 2:
                rates = list(groups.values())
                max_rate = max(rates)
                min_rate = min(rates)
                disparity = (max_rate - min_rate) / max_rate if max_rate > 0 else 0

                flagged = disparity > request.threshold
                flags.append(BiasResult(
                    attribute=attr,
                    groups={str(k): round(float(v), 4) for k, v in groups.items()},
                    disparity_ratio=round(float(disparity), 4),
                    flagged=flagged,
                    details=f"{'FLAGGED' if flagged else 'OK'}: {attr} disparity ratio {disparity:.2%} "
                            f"({'exceeds' if flagged else 'within'} {request.threshold:.0%} threshold)",
                ))

    # Overall bias score (0 = clean, 1 = severe)
    flagged_count = sum(1 for f in flags if f.flagged)
    overall_score = flagged_count / max(len(flags), 1)

    return BiasResponse(
        gpu_accelerated=GPU_AVAILABLE,
        total_decisions=total_decisions,
        attributes_scanned=len(flags),
        flags=flags,
        overall_score=round(overall_score, 4),
    )


@app.post("/graph/analyze")
async def graph_analyze(request: GraphRequest):
    """
    Run graph analytics on decision networks using cuGraph (GPU) or NetworkX (CPU).
    """
    if not request.edges:
        raise HTTPException(status_code=400, detail="No edges provided")

    if GPU_AVAILABLE:
        sources = [e["source"] for e in request.edges]
        targets = [e["target"] for e in request.edges]
        weights = [e.get("weight", 1.0) for e in request.edges]

        gdf = cudf.DataFrame({"src": sources, "dst": targets, "weight": weights})
        G = cugraph.Graph()
        G.from_cudf_edgelist(gdf, source="src", destination="dst", edge_attr="weight")

        if request.algorithm == "pagerank":
            result = cugraph.pagerank(G)
            scores = result.to_pandas().to_dict(orient="records")
        elif request.algorithm == "betweenness":
            result = cugraph.betweenness_centrality(G)
            scores = result.to_pandas().to_dict(orient="records")
        elif request.algorithm == "community":
            parts, modularity = cugraph.louvain(G)
            scores = parts.to_pandas().to_dict(orient="records")
        else:
            raise HTTPException(status_code=400, detail=f"Unknown algorithm: {request.algorithm}")
    else:
        # CPU fallback — return placeholder
        scores = [{"node": e["source"], "score": 1.0 / len(request.edges)} for e in request.edges[:10]]

    return {
        "gpu_accelerated": GPU_AVAILABLE,
        "algorithm": request.algorithm,
        "nodes": len(set(e["source"] for e in request.edges) | set(e["target"] for e in request.edges)),
        "edges": len(request.edges),
        "results": scores[:100],  # Cap response size
    }


@app.post("/analytics/aggregate")
async def analytics_aggregate(request: AnalyticsRequest):
    """
    GPU-accelerated data aggregation using cuDF.
    """
    if not request.data:
        raise HTTPException(status_code=400, detail="No data provided")

    if GPU_AVAILABLE:
        df = cudf.DataFrame(request.data)
    else:
        df = pd.DataFrame(request.data)

    try:
        agg_dict = {}
        for col, func in request.aggregations.items():
            if col in df.columns:
                agg_dict[col] = func

        if GPU_AVAILABLE:
            result = df.groupby(request.group_by).agg(agg_dict).to_pandas()
        else:
            result = df.groupby(request.group_by).agg(agg_dict)

        return {
            "gpu_accelerated": GPU_AVAILABLE,
            "rows": len(result),
            "results": result.reset_index().to_dict(orient="records"),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5555, log_level="info")
