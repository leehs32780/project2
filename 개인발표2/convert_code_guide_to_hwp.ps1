$ErrorActionPreference = "Stop"

$inputPath = (Resolve-Path -LiteralPath "SKY_FINDER_화면별_코드설명.html").Path
$outputPath = Join-Path (Get-Location) "SKY_FINDER_화면별_코드설명.hwp"
$hwp = $null

try {
  $hwp = New-Object -ComObject HWPFrame.HwpObject.2
  $hwp.XHwpWindows.Item(0).Visible = $false

  if (-not $hwp.Open($inputPath, "HTML", "forceopen:true")) {
    throw "HTML 문서를 한글에서 열지 못했습니다."
  }

  if (-not $hwp.SaveAs($outputPath, "HWP", "")) {
    throw "HWP 저장에 실패했습니다."
  }

  Write-Output "CREATED=$outputPath"
}
finally {
  if ($null -ne $hwp) {
    try { $hwp.Quit() } catch {}
    [Runtime.InteropServices.Marshal]::FinalReleaseComObject($hwp) | Out-Null
  }
}
