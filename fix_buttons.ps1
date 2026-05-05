# Fix the broken button in SecurityPage.tsx
$filePath = "c:\Users\jflor\OneDrive\Desktop\TRABAJO\BUNTY\src\pages\modules\SecurityPage.tsx"
$content = Get-Content $filePath -Raw

# Replace the broken button code
$brokenCode = @'
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-4 rounded-xl flex flex-col items-center gap-2 onClick={() => setShowVehicleModal(true)} className=" glass-card p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-500/10 transition-colors\"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-medium text-foreground">Registrar Vehículo</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-purple-500/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs font-medium text-foreground">Contactar Portería</span>
            </motion.button>
'@

$fixedCode = @'
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowVehicleModal(true)}
              className="glass-card p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-blue-500/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-medium text-foreground">Registrar Vehículo</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPorteriaModal(true)}
              className="glass-card p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-purple-500/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs font-medium text-foreground">Contactar Portería</span>
            </motion.button>
'@

$content = $content -replace [regex]::Escape($brokenCode), $fixedCode
Set-Content -Path $filePath -Value $content -NoNewline
Write-Host "Fixed buttons!"
