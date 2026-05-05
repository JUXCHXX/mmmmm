$content = Get-Content 'src/pages/modules/SettingsPage.tsx' -Raw
$content = $content -replace 'bg-gradient-to-br from-\[#0F7A5C\]/10 to-\[#023047\]/10 rounded-2xl p-6 border border-\[#0F7A5C\]/20', 'bg-white dark:bg-gray-800 rounded-2xl p-6 border border-border'
$content = $content -replace 'bg-white/50 dark:bg-gray-800/50', 'bg-gray-50 dark:bg-gray-700'
$content = $content -replace 'bg-muted/30 border border-border', 'bg-gray-50 dark:bg-gray-700 border border-border'
Set-Content 'src/pages/modules/SettingsPage.tsx' -Value $content -NoNewline
Write-Host "Done"
