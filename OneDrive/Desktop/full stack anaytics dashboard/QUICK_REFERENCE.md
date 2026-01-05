# 🚀 Quick Reference: Data Storage Cheat Sheet

## 📝 How to Store Data - 3 Simple Steps

### Step 1: Create the Service Method (Already Done ✅)
```typescript
// File: analytics.service.ts
createAnalyticsData(metricName: string, value: number, category: string) {
  return this.http.post(`${this.apiUrl}/data`, null, {
    headers: this.getHeaders(),
    params: { metric_name: metricName, value, category }
  });
}
```

### Step 2: Call from Component
```typescript
// In your component
constructor(private analyticsService: AnalyticsService) {}

storeData() {
  this.analyticsService.createAnalyticsData(
    'page_views',  // metric name
    1500,          // value
    'website'      // category
  ).subscribe({
    next: (response) => console.log('Stored:', response),
    error: (error) => console.error('Error:', error)
  });
}
```

### Step 3: Bind to Template
```html
<button (click)="storeData()">Store Data</button>
```

---

## 🎯 Common Use Cases

### 1. Track Page Views
```typescript
trackPageView(page: string, views: number) {
  this.analyticsService.createAnalyticsData('page_views', views, page)
    .subscribe(response => console.log('Tracked!'));
}
```

### 2. Track User Actions
```typescript
trackClick(buttonName: string) {
  this.analyticsService.createAnalyticsData('button_clicks', 1, buttonName)
    .subscribe(response => console.log('Click tracked!'));
}
```

### 3. Store Multiple Metrics
```typescript
storeMultipleMetrics() {
  const metrics = [
    { metric_name: 'users', value: 1250, category: 'stats' },
    { metric_name: 'revenue', value: 45000, category: 'sales' }
  ];
  
  this.analyticsService.createBulkAnalyticsData(metrics)
    .subscribe(response => console.log(`${response.count} stored!`));
}
```

---

## 🔑 Key Files

| File | Purpose | Location |
|------|---------|----------|
| **analytics_routes.py** | Backend API endpoints | `backend/routers/` |
| **analytics.service.ts** | Frontend HTTP service | `frontend/src/app/core/services/` |
| **models.py** | Database models | `backend/` |
| **analytics.db** | SQLite database file | `backend/` |

---

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/analytics/data` | Store single record |
| POST | `/analytics/data/bulk` | Store multiple records |
| GET | `/analytics/data` | Get all records |
| GET | `/analytics/data/{id}` | Get single record |
| PUT | `/analytics/data/{id}` | Update record |
| DELETE | `/analytics/data/{id}` | Delete record |

---

## 🧪 Testing

### Test Backend (Swagger UI)
1. Open: `http://localhost:8000/docs`
2. Click "Authorize" → Login
3. Try POST `/analytics/data`

### Test Frontend
1. Navigate to: `http://localhost:4200/data-storage-example`
2. Fill form and click "Store Data"
3. Check browser console

---

## 🐛 Common Errors & Solutions

### Error: "401 Unauthorized"
**Solution:** Make sure you're logged in and token is stored
```typescript
// Check if token exists
const token = localStorage.getItem('access_token');
console.log('Token:', token);
```

### Error: "CORS Error"
**Solution:** Backend CORS is configured for `localhost:4200`
```python
# In main.py - already configured ✅
origins = ["http://localhost:4200"]
```

### Error: "Cannot read property of undefined"
**Solution:** Check if service is injected in constructor
```typescript
constructor(private analyticsService: AnalyticsService) {}
```

---

## 💡 Pro Tips

1. **Always handle errors:**
```typescript
.subscribe({
  next: (data) => { /* success */ },
  error: (err) => { /* handle error */ }  // ← Don't forget this!
});
```

2. **Use loading states:**
```typescript
isLoading = false;

storeData() {
  this.isLoading = true;
  this.analyticsService.createAnalyticsData(...)
    .subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
}
```

3. **Validate before sending:**
```typescript
if (!metricName || !category) {
  alert('Please fill all fields');
  return;
}
```

---

## 📊 Data Flow Summary

```
User Action
    ↓
Component Method
    ↓
Service (HTTP Request)
    ↓
Backend API
    ↓
Database (SQLite)
    ↓
Response Back to Frontend
    ↓
Update UI
```

---

## 🎓 Next Steps

1. ✅ Read `DATA_STORAGE_GUIDE.md` for detailed explanation
2. ✅ Check example component: `data-storage-example.component.ts`
3. ✅ Test API at: `http://localhost:8000/docs`
4. ✅ Build your own features using the same pattern!

---

**Need Help?** Check the complete guide in `DATA_STORAGE_GUIDE.md`
