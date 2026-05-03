export const SAMPLE_DATASETS = [
  {
    name: "Users List",
    data: [
      { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "role": "Admin", "active": true },
      { "id": 2, "name": "Bob Smith", "email": "bob@example.com", "role": "User", "active": false },
      { "id": 3, "name": "Charlie Brown", "email": "charlie@example.com", "role": "Editor", "active": true },
      { "id": 4, "name": "Diana Prince", "email": "diana@example.com", "role": "User", "active": true },
      { "id": 5, "name": "Ethan Hunt", "email": "ethan@example.com", "role": "Admin", "active": false }
    ]
  },
  {
    name: "Product Catalog",
    data: [
      { "sku": "KB-001", "name": "Mechanical Keyboard", "price": 120.50, "stock": 45, "category": "Peripherals" },
      { "sku": "MS-002", "name": "Wireless Mouse", "price": 45.99, "stock": 120, "category": "Peripherals" },
      { "sku": "MN-003", "name": "4K Monitor", "price": 350.00, "stock": 15, "category": "Displays" },
      { "sku": "CH-004", "name": "Ergonomic Chair", "price": 280.00, "stock": 10, "category": "Furniture" }
    ]
  },
  {
    name: "System Logs",
    data: [
      { "timestamp": "2024-03-20T10:00:00Z", "level": "INFO", "source": "AuthService", "message": "User login successful" },
      { "timestamp": "2024-03-20T10:05:22Z", "level": "WARN", "source": "DBPipe", "message": "High latency detected" },
      { "timestamp": "2024-03-20T10:10:45Z", "level": "ERROR", "source": "Storage", "message": "Disk space low" },
      { "timestamp": "2024-03-20T10:15:10Z", "level": "INFO", "source": "AuthService", "message": "Session expired" }
    ]
  }
];
