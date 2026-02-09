-- Insurance table
CREATE TABLE IF NOT EXISTS insurance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  policy_number VARCHAR(100),
  type VARCHAR(100) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  coverage_amount DECIMAL(15, 2) NOT NULL,
  premium_amount DECIMAL(15, 2) NOT NULL,
  premium_frequency ENUM('monthly', 'quarterly', 'half-yearly', 'yearly') NOT NULL,
  start_date DATE,
  end_date DATE,
  next_premium_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_policy_number (policy_number),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
