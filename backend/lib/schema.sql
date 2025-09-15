-- Create database schema for Arsip Kependudukan

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Arsip table
CREATE TABLE IF NOT EXISTS arsip (
    id SERIAL PRIMARY KEY,
    jenis_arsip VARCHAR(50) NOT NULL,
    nomor_akta VARCHAR(50) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    jenis_kelamin VARCHAR(20) CHECK (jenis_kelamin IN ('laki-laki', 'perempuan')),
    alamat TEXT,
    nama_ayah VARCHAR(100),
    nama_ibu VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'tersimpan', 'ditolak')),
    keterangan TEXT,
    file_path VARCHAR(255),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_arsip_nomor_akta ON arsip(nomor_akta);
CREATE INDEX IF NOT EXISTS idx_arsip_nama_lengkap ON arsip(nama_lengkap);
CREATE INDEX IF NOT EXISTS idx_arsip_status ON arsip(status);

-- Insert default admin user (password: admin123)
-- bcrypt hash for 'admin123': $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (username, password_hash)
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;
