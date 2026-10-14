"""Íconos de la app instalable a partir de app/icon.png (monograma sobre marfil)."""
from PIL import Image

src = Image.open("app/icon.png").convert("RGBA")
bg = (0xF4, 0xF1, 0xEC, 255)

def make(size: int, inner: float, path: str) -> None:
    canvas = Image.new("RGBA", (size, size), bg)
    mark = src.copy()
    mark.thumbnail((int(size * inner), int(size * inner)), Image.LANCZOS)
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    canvas.convert("RGB").quantize(colors=48, method=Image.Quantize.MEDIANCUT).save(path, optimize=True)

make(192, 0.72, "public/app/icon-192.png")
make(512, 0.72, "public/app/icon-512.png")
make(512, 0.56, "public/app/icon-maskable-512.png")   # zona segura para íconos recortados
make(180, 0.70, "public/app/apple-touch-icon.png")
print("íconos listos")
