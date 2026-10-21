import os
import subprocess
import shutil

base_dir = r"c:\Users\User\Desktop\fsd proj\docs"
screens_dir = os.path.join(base_dir, "screenshots")
chrome = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
temp_screen_dir = r"C:\Users\User\Desktop\agrostrat_screens"
os.makedirs(temp_screen_dir, exist_ok=True)
os.makedirs(screens_dir, exist_ok=True)

with open(os.path.join(base_dir, "diagrams_napkin.html"), "r", encoding="utf-8") as f:
    full_html = f.read()

parts = {
    "fig4_1_architecture.png": ("<!-- FIGURE 4.1:", "<!-- FIGURE 4.2:", 620),
    "fig4_2_usecase.png": ("<!-- FIGURE 4.2:", "<!-- FIGURE 4.3:", 420),
    "fig4_3_er_diagram.png": ("<!-- FIGURE 4.3:", "<!-- FIGURE 4.4:", 500),
    "fig4_4_component_diagram.png": ("<!-- FIGURE 4.4:", "<!-- FIGURE 4.5:", 480),
    "fig4_5_sequence_diagram.png": ("<!-- FIGURE 4.5:", "</body>", 560)
}

head = full_html.split("<body>")[0] + """<body style="background:#ffffff; padding:15px; margin:0; display:flex; justify-content:center;">"""

for out_name, (start_str, end_str, height) in parts.items():
    s = full_html.find(start_str)
    e = full_html.find(end_str, s)
    snippet = full_html[s:e].strip()
    html_content = head + snippet + "</body></html>"
    
    temp_html = os.path.join(base_dir, f"temp_{out_name}.html")
    with open(temp_html, "w", encoding="utf-8") as out_f:
        out_f.write(html_content)
    
    temp_img = os.path.join(temp_screen_dir, out_name)
    out_img = os.path.join(screens_dir, out_name)
    
    cmd = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--window-size=1020,{height + 60}",
        f"--screenshot={temp_img}",
        temp_html
    ]
    subprocess.run(cmd, check=True)
    shutil.copyfile(temp_img, out_img)
    print(f"Successfully generated {out_name} ({os.path.getsize(out_img)} bytes)")

# Also copy to artifact directory
art_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\f72f05a4-f7a8-46a6-b906-17005fa37895"
for out_name in parts.keys():
    shutil.copyfile(os.path.join(screens_dir, out_name), os.path.join(art_dir, out_name))
print("All 5 diagrams rendered and mirrored to artifact directory successfully.")
