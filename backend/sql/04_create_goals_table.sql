-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0,
  deadline DATE,
  category VARCHAR(100) NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  is_completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  recurring_amount DECIMAL(15, 2) DEFAULT 0,
  recurring_frequency ENUM('none', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly') DEFAULT 'none',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_category (category),
  INDEX idx_priority (priority),
  INDEX idx_deadline (deadline),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
