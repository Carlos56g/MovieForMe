# start-servers.ps1

# Relative Routes
$frontendPath = ".\Source\Client\ReactWebApp"
$backendPath = ".\Source\Server"

# Server Virtual Env Command
$venvActivate = ".\venv1\Scripts\Activate.ps1"

# Server Init
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$backendPath`"; & `"$venvActivate`"; uvicorn main:app --reload"

# Client Init
#Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$frontendPath`"; npm run dev"
