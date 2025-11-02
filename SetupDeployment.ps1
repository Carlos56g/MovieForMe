# setup.ps1
Write-Host "=== SETUP START ==="

# Rutas relativas
$frontendPath = ".\Source\Client\ReactWebApp"
$backendPath = ".\Source\Server"
$venvPath = "$backendPath\.venv"

# 1️⃣ Crear virtual environment si no existe
if (-Not (Test-Path $venvPath)) {
    Write-Host "Creating Python virtual environment..."
    python -m venv $venvPath
} else {
    Write-Host "Virtual environment already exists."
}

# 2️⃣ Activar virtual environment
$activateVenv = "$venvPath\Scripts\Activate.ps1"
Write-Host "Activating virtual environment..."
& $activateVenv

# 3️⃣ Instalar dependencias de Python
Write-Host "Installing Python packages..."
pip install --upgrade pip
pip install -r "$backendPath\requirements.txt"

# 4️⃣ Instalar dependencias de React
Write-Host "Installing React packages..."
cd $frontendPath
npm install
cd ..

Write-Host "=== SETUP COMPLETE ==="
Write-Host "=== Run the File StartApp.ps1 ==="

Read-Host "Press Enter to continue"
