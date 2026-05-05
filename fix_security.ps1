# Fix SecurityPage.tsx syntax error
$filePath = "c:\Users\jflor\OneDrive\Desktop\TRABAJO\BUNTY\src\pages\modules\SecurityPage.tsx"
$content = Get-Content $filePath -Raw

# Fix the broken button
$broken = 'onClick={() => setShowVehicleModal(true)} className="glass-card p-4 rounded-xl flex flex-col items-center gap-2 onClick={() => setShowVehicleModal(true)} className=" glass-card p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-500/10 transition-colors"'
$fixed = 'onClick={() => setShowVehicleModal(true)}
              className="glass-card p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-500/10 transition-colors"'

$content = $content -replace [regex]::Escape($broken), $fixed

# Add onClick to the Contactar Porteria button if missing
$porteriaPattern = 'Contactar Porter.*?<motion\.button\s+whileHover'
$match = [regex]::Match($content, $porteriaPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($match.Success) {
    Write-Host "Found porteria button section"
}

Set-Content -Path $filePath -Value $content -NoNewline
Write-Host "Fixed!"
