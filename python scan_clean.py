import os

# Tên file kết quả sẽ lưu
OUTPUT_FILE = 'cau_truc_du_an.txt'

def scan_and_save(startpath):
    # ⛔ DANH SÁCH ĐEN: Các thư mục rác cần bỏ qua
    BLOCK_LIST = {
        'node_modules', '.git', '__pycache__', 
        'dist', 'build', 'coverage', '.vscode', '.idea',
        'migrations', 'venv', 'env', '.DS_Store'
    }

    # Mở file để ghi kết quả (encoding utf-8 để viết tiếng Việt ko lỗi)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        
        # Hàm nhỏ giúp in ra màn hình VÀ ghi vào file cùng lúc
        def log(text):
            print(text)      # In ra màn hình đen
            f.write(text + '\n') # Ghi vào file txt

        root_name = os.path.basename(os.path.abspath(startpath))
        log(f"PROJECT STRUCTURE: {root_name}")
        log("=" * 30)
        log(f"{root_name}/")

        for root, dirs, files in os.walk(startpath):
            # Chặn không cho vào các thư mục rác
            dirs[:] = [d for d in dirs if d not in BLOCK_LIST]
            
            level = root.replace(startpath, '').count(os.sep)
            indent = '│   ' * level + '├── '
            
            # In tên thư mục con
            if level > 0:
                log(f'{indent}{os.path.basename(root)}/')
            
            # In tên file (Trừ file scan này và file kết quả ra)
            sub_indent = '│   ' * (level + 1) + '├── '
            for file in files:
                if not file.startswith('.') and file != OUTPUT_FILE and file != os.path.basename(__file__):
                    log(f'{sub_indent}{file}')

    print(f"\n✅ Đã quét xong! Kết quả đã được lưu vào file: {OUTPUT_FILE}")

if __name__ == "__main__":
    # Dấu chấm . đại diện cho thư mục hiện tại
    scan_and_save('.')