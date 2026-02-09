-- Tax table
CREATE TABLE IF NOT EXISTS tax (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  financial_year VARCHAR(20) NOT NULL,
  total_income DECIMAL(15, 2) NOT NULL,
  deductions DECIMAL(15, 2) DEFAULT 0,
  taxable_income DECIMAL(15, 2) NOT NULL,
  tax_paid DECIMAL(15, 2) DEFAULT 0,
  tax_liability DECIMAL(15, 2) NOT NULL,
  regime ENUM('old', 'new') DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_financial_year (financial_year),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
