# WINDOWS TASK SCHEDULER BACKUP AUTOMATION
**Automate daily database backups on Windows**

---

## SETUP AUTOMATED BACKUPS

### Step 1: Open Task Scheduler
1. Press `Windows + R`
2. Type: `taskschd.msc`
3. Press Enter

### Step 2: Create New Task
1. Click "Create Basic Task" (right panel)
2. Name: `Datacendia Daily Backup`
3. Description: `Automated PostgreSQL database backup`
4. Click "Next"

### Step 3: Set Trigger
1. Select: "Daily"
2. Click "Next"
3. Start date: Today
4. Start time: `02:00 AM` (2 AM when system is idle)
5. Recur every: `1 days`
6. Click "Next"

### Step 4: Set Action
1. Select: "Start a program"
2. Click "Next"
3. Program/script: `powershell.exe`
4. Add arguments: `-ExecutionPolicy Bypass -File "C:\Users\Stu\Documents\datacendia-components\datacendia-components\scripts\backup-database.ps1"`
5. Start in: `C:\Users\Stu\Documents\datacendia-components\datacendia-components`
6. Click "Next"

### Step 5: Finish
1. Check "Open the Properties dialog"
2. Click "Finish"

### Step 6: Configure Advanced Settings
1. In Properties dialog:
   - Check "Run whether user is logged on or not"
   - Check "Run with highest privileges"
   - Configure for: Windows 10/11
2. Click "OK"
3. Enter your Windows password when prompted

**Done!** Backups will run automatically every day at 2 AM.

---

## VERIFY BACKUP IS WORKING

### Test Run Immediately
1. Open Task Scheduler
2. Find "Datacendia Daily Backup"
3. Right-click → "Run"
4. Check `backups` folder for new backup file

### Check Backup Logs
1. Task Scheduler → "Datacendia Daily Backup"
2. Click "History" tab
3. Look for recent runs
4. Status should be "Success (0x0)"

### Verify Backup Files
```powershell
# List recent backups
Get-ChildItem .\backups\ -Filter "datacendia_*.sql*" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

---

## BACKUP SCHEDULE OPTIONS

### Daily at 2 AM (Recommended)
- Low system usage time
- Minimal impact on users
- Consistent schedule

### Every 6 Hours (High-Frequency)
- More frequent backups
- Better data protection
- Higher disk usage

### Weekly (Low-Frequency)
- Less disk usage
- Suitable for low-change environments
- Higher risk of data loss

---

## BACKUP RETENTION

**Current:** 30 days (configurable in script)

**Modify retention:**
```powershell
# Edit scripts/backup-database.ps1
# Change this line:
$cutoffDate = (Get-Date).AddDays(-30)  # Change -30 to desired days
```

**Recommended retention:**
- Development: 7 days
- Production: 30-90 days
- Compliance: 7 years (archive to external storage)

---

## RESTORE FROM BACKUP

### Step 1: Stop Backend
```powershell
# Press Ctrl+C in backend terminal
```

### Step 2: List Available Backups
```powershell
Get-ChildItem .\backups\ -Filter "datacendia_*.sql*"
```

### Step 3: Restore Database
```powershell
# If backup is compressed (.gz)
gunzip .\backups\datacendia_20260126_020000.sql.gz

# Restore to database
Get-Content .\backups\datacendia_20260126_020000.sql | docker exec -i datacendia-postgres psql -U datacendia datacendia
```

### Step 4: Restart Backend
```powershell
cd backend
npm run dev
```

### Step 5: Verify
```powershell
# Check health endpoint
curl http://localhost:3001/api/v1/health
```

---

## TROUBLESHOOTING

### Task Doesn't Run
**Check:**
1. Task Scheduler → History tab
2. Look for error messages
3. Verify PowerShell path is correct
4. Ensure script path has no spaces (use quotes)

### "Execution Policy" Error
**Fix:**
```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Backup File Not Created
**Check:**
1. Docker container is running: `docker ps | findstr postgres`
2. Backup directory exists: `Test-Path .\backups`
3. Script has write permissions

### Disk Space Full
**Fix:**
```powershell
# Reduce retention period
# Or move backups to external drive
# Or compress backups
```

---

## BACKUP TO EXTERNAL STORAGE

### Option 1: Network Drive
```powershell
# Modify backup script to copy to network drive
$NETWORK_BACKUP = "\\server\backups\datacendia"
Copy-Item $BACKUP_FILE $NETWORK_BACKUP
```

### Option 2: Cloud Storage (AWS S3)
```powershell
# Install AWS CLI
# Configure credentials
aws s3 cp $BACKUP_FILE s3://your-bucket/backups/
```

### Option 3: Azure Blob Storage
```powershell
# Install Azure CLI
# Configure credentials
az storage blob upload --file $BACKUP_FILE --container backups
```

---

## MONITORING BACKUPS

### Email Notifications
```powershell
# Add to backup script
$emailParams = @{
    From = "backups@yourcompany.com"
    To = "admin@yourcompany.com"
    Subject = "Datacendia Backup Completed - $DATE"
    Body = "Backup file: $BACKUP_FILE`nSize: $size MB"
    SmtpServer = "smtp.yourcompany.com"
}
Send-MailMessage @emailParams
```

### Slack Notifications
```powershell
# Add to backup script
$slackWebhook = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
$payload = @{
    text = "✅ Datacendia backup completed: $BACKUP_FILE"
} | ConvertTo-Json

Invoke-RestMethod -Uri $slackWebhook -Method Post -Body $payload -ContentType 'application/json'
```

---

## BEST PRACTICES

✅ **Test restores monthly** - Verify backups actually work  
✅ **Store backups off-site** - Protect against hardware failure  
✅ **Monitor backup success** - Set up notifications  
✅ **Document restore procedures** - Team knows how to recover  
✅ **Encrypt backups** - Protect sensitive data  

---

**Automated backups are now configured. Database is protected.**
