# =============================================================================
# DATACENDIA DATABASE BACKUP SCRIPT (Windows PowerShell)
# =============================================================================
# Automated daily backup of PostgreSQL database

$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_DIR = ".\backups"
$BACKUP_FILE = "$BACKUP_DIR\datacendia_$DATE.sql"
$COMPRESSED_FILE = "$BACKUP_FILE.gz"

# Create backup directory if it doesn't exist
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
    Write-Host "Created backup directory: $BACKUP_DIR"
}

Write-Host "Starting database backup..."
Write-Host "Backup file: $BACKUP_FILE"

# Backup database using docker exec
try {
    docker exec datacendia-postgres pg_dump -U cendia datacendia > $BACKUP_FILE
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database backup completed successfully"
        
        # Compress backup
        if (Get-Command "gzip" -ErrorAction SilentlyContinue) {
            gzip $BACKUP_FILE
            Write-Host "✅ Backup compressed: $COMPRESSED_FILE"
        } else {
            Write-Host "⚠️  gzip not found - backup not compressed"
        }
        
        # Delete backups older than 30 days
        $cutoffDate = (Get-Date).AddDays(-30)
        Get-ChildItem -Path $BACKUP_DIR -Filter "datacendia_*.sql*" | 
            Where-Object { $_.LastWriteTime -lt $cutoffDate } | 
            Remove-Item -Force
        
        Write-Host "✅ Old backups cleaned up (kept last 30 days)"
        
        # Show backup size
        if (Test-Path $COMPRESSED_FILE) {
            $size = (Get-Item $COMPRESSED_FILE).Length / 1MB
            Write-Host "Backup size: $([math]::Round($size, 2)) MB"
        } elseif (Test-Path $BACKUP_FILE) {
            $size = (Get-Item $BACKUP_FILE).Length / 1MB
            Write-Host "Backup size: $([math]::Round($size, 2)) MB"
        }
        
        # List recent backups
        Write-Host "`nRecent backups:"
        Get-ChildItem -Path $BACKUP_DIR -Filter "datacendia_*.sql*" | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -First 5 | 
            ForEach-Object {
                $size = $_.Length / 1MB
                Write-Host "  $($_.Name) - $([math]::Round($size, 2)) MB - $($_.LastWriteTime)"
            }
    } else {
        Write-Host "❌ Database backup failed"
        exit 1
    }
} catch {
    Write-Host "❌ Error during backup: $_"
    exit 1
}

Write-Host "`n✅ Backup completed successfully"
