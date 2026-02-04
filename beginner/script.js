/**
 * ZENTASK 2026 - CORE LOGIC
 * Menggunakan konsep 'State-Driven UI' sederhana: 
 * Data (State) berubah -> Simpan di LocalStorage -> Gambar ulang layar (Render)
 */

// 1. Inisialisasi State (Data Utama)
// Mengambil data dari memori browser atau membuat array kosong jika belum ada data
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 2. Fungsi Utama saat Halaman Dimuat
window.addEventListener('load', () => {
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    // Menampilkan Nama Pengguna yang tersimpan
    nameInput.value = localStorage.getItem('username') || '';

    // Auto-save Nama: Setiap kali nama diubah, langsung simpan
    nameInput.addEventListener('input', (e) => {
        localStorage.setItem('username', e.target.value);
    });

    // Menangani Penambahan Tugas Baru
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault(); // Mencegah halaman refresh

        // Membuat objek tugas baru dengan ID unik berbasis waktu
        const todo = {
            id: new Date().getTime(),
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false
        }

        todos.push(todo); // Masukkan ke dalam daftar
        saveAndRefresh(); // Simpan dan update tampilan
        e.target.reset(); // Kosongkan form kembali
    });

    renderTodos(); // Tampilkan data saat pertama kali buka aplikasi
    updateDate();  // Tampilkan tanggal hari ini
});

// 3. FUNGSI RENDER (Menampilkan Data ke HTML)
function renderTodos() {
    const todoList = document.querySelector('#todo-list');
    const taskCount = document.querySelector('#task-count');
    
    todoList.innerHTML = ""; // Bersihkan list lama agar tidak duplikat

    // Update Counter: Menampilkan jumlah tugas yang belum selesai
    const remainingTasks = todos.filter(t => !t.done).length;
    taskCount.innerText = `${remainingTasks} Tugas Tersisa`;

    // Tampilkan pesan jika list kosong (Empty State)
    if (todos.length === 0) {
        todoList.innerHTML = `<div class="empty-state">Hening sekali di sini... Mulai harimu dengan satu tugas!</div>`;
        return;
    }

    // Urutkan: Tugas yang belum selesai di atas, yang sudah selesai di bawah
    const sortedTodos = [...todos].sort((a, b) => a.done - b.done);

    sortedTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.done ? 'done' : ''}`;

        // Menggunakan Template Literals agar struktur HTML mudah dibaca oleh pemula
        todoItem.innerHTML = `
            <label class="todo-label">
                <input type="checkbox" ${todo.done ? 'checked' : ''}>
                <span class="bubble ${todo.category}"></span>
            </label>
            <div class="todo-content">
                <input type="text" value="${todo.content}" readonly>
            </div>
            <div class="actions">
                <button class="edit-btn">Ubah</button>
                <button class="delete-btn">Hapus</button>
            </div>
        `;

        // --- EVENT LISTENER UNTUK SETIAP ITEM ---

        const checkbox = todoItem.querySelector('input');
        const editBtn = todoItem.querySelector('.edit-btn');
        const deleteBtn = todoItem.querySelector('.delete-btn');
        const textInput = todoItem.querySelector('.todo-content input');

        // Fitur Ceklis Selesai
        checkbox.addEventListener('change', () => {
            todo.done = checkbox.checked;
            saveAndRefresh();
        });

        // Fitur Edit (Ubah/Simpan)
        editBtn.addEventListener('click', () => {
            if (textInput.hasAttribute('readonly')) {
                textInput.removeAttribute('readonly');
                textInput.focus();
                editBtn.innerText = "Simpan";
                editBtn.classList.add('saving'); // Beri warna berbeda saat menyimpan
            } else {
                textInput.setAttribute('readonly', true);
                todo.content = textInput.value;
                editBtn.innerText = "Ubah";
                editBtn.classList.remove('saving');
                saveAndRefresh();
            }
        });

        // Fitur Hapus (Menggunakan Filter)
        deleteBtn.addEventListener('click', () => {
            // Mencocokkan ID unik untuk dihapus dari array
            todos = todos.filter(t => t.id !== todo.id);
            saveAndRefresh();
        });

        todoList.appendChild(todoItem);
    });
}

// 4. FUNGSI PEMBANTU (Helper Functions)
function saveAndRefresh() {
    // Simpan ke LocalStorage dalam bentuk String
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos(); // Gambar ulang tampilan
}

function updateDate() {
    const dateEl = document.querySelector('#current-date');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    dateEl.innerText = new Date().toLocaleDateString('id-ID', options);
}