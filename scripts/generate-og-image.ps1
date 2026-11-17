# Original geometry and typography only; no third-party illustrations or photos.
# Run on Windows: pwsh -File scripts/generate-og-image.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$repoPath = Split-Path $PSScriptRoot -Parent
$tokens = Get-Content (Join-Path $repoPath 'src/theme/tokens.ts') -Raw
function Color($name) {
    $hex = [regex]::Match($tokens, "${name}: '(#[A-Fa-f0-9]{6})'").Groups[1].Value
    if (!$hex) { throw "Missing color token: $name" }
    [System.Drawing.ColorTranslator]::FromHtml($hex)
}
$bitmap = [System.Drawing.Bitmap]::new(1200, 630, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = 'AntiAlias'
$g.TextRenderingHint = 'AntiAliasGridFit'
$g.Clear((Color 'background'))
$resources = [System.Collections.Generic.List[System.IDisposable]]::new()
function Brush($name) {
    $item = [System.Drawing.SolidBrush]::new((Color $name)); $resources.Add($item); return $item
}
function Pen($name, $width) {
    $item = [System.Drawing.Pen]::new((Color $name), $width); $resources.Add($item); return $item
}
try {
    $font = [System.Drawing.Font]::new('Yu Gothic UI', 74, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $copy = [System.Drawing.Font]::new('Yu Gothic UI', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $resources.Add($font); $resources.Add($copy)
    if ($font.Name -ne 'Yu Gothic UI') { throw 'Yu Gothic UI font is required for Japanese text.' }
    $g.FillRectangle((Brush 'primary'), 0, 0, 1200, 16)
    $g.FillEllipse((Brush 'honey'), 1010, -90, 280, 280)
    $g.FillEllipse((Brush 'soft'), -100, 490, 280, 280)
    $g.FillRectangle((Brush 'orange'), 80, 155, 64, 8)
    $g.DrawString('こんだて日和', $font, (Brush 'primary'), 72, 197)
    $g.DrawString('毎日の『何を作ろう』を、', $copy, (Brush 'text'), 80, 334)
    $g.DrawString('少し軽く。', $copy, (Brush 'text'), 80, 385)
    # Plate, tomato, omelette and cutlery, drawn from original simple shapes.
    $g.FillEllipse((Brush 'border'), 762, 203, 316, 316)
    $g.FillEllipse((Brush 'surface'), 752, 190, 316, 316)
    $g.DrawEllipse((Pen 'border' 3), 780, 218, 260, 260)
    $g.FillEllipse((Brush 'honey'), 812, 269, 148, 94)
    $g.FillEllipse((Brush 'orange'), 827, 283, 120, 57)
    $g.FillEllipse((Brush 'primary'), 907, 356, 69, 65)
    $g.DrawLine((Pen 'text' 3), 940, 355, 932, 344)
    $g.DrawLine((Pen 'text' 3), 940, 355, 950, 345)
    $g.DrawArc((Pen 'primary' 5), 821, 383, 50, 28, 10, 155)
    $g.DrawLine((Pen 'text' 7), 713, 279, 713, 441)
    $g.DrawArc((Pen 'text' 6), 692, 242, 42, 65, 0, 180)
    foreach ($x in @(692, 713, 734)) { $g.DrawLine((Pen 'text' 5), $x, 242, $x, 274) }
    $g.DrawLine((Pen 'text' 7), 1102, 323, 1102, 441)
    $g.DrawEllipse((Pen 'text' 6), 1082, 243, 40, 80)
    $output = Join-Path $repoPath 'public/og-kondate-biyori.png'
    [System.IO.Directory]::CreateDirectory((Split-Path $output -Parent)) | Out-Null
    $bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
    Get-Item $output | Select-Object FullName, Length
} finally {
    foreach ($item in $resources) { $item.Dispose() }
    $g.Dispose(); $bitmap.Dispose()
}
