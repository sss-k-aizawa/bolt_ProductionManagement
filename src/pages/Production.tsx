The main issue in this file is missing closing brackets and parentheses. Here's the fixed version of the problematic sections:

1. In the inventory level status section, there was a missing closing bracket and incorrect nesting. Here's the corrected version:

```javascript
{dates.map((date) => {
  const forecastStock = productInventoryForecast[key]?.[date] || 0;
  const isToday = format(new Date(), 'yyyy-MM-dd') === date;
  const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
  
  return (
    <td key={`${key}-${date}`} className={`px-4 py-4 whitespace-nowrap text-sm ${
      isToday ? 'bg-blue-50' : isWeekend ? 'bg-gray-50' : ''
    }`}>
      <div className="text-center">
        <div className={`font-medium ${getInventoryLevelColor(forecastStock, destination.min_quantity, destination.max_quantity)}`}>
          {forecastStock.toLocaleString()}
        </div>
        <div className={`text-xs px-1 py-0.5 rounded mt-1 ${
          getInventoryLevelStatus(forecastStock, destination.min_quantity, destination.max_quantity) === '在庫切れ' ? 'bg-red-100 text-red-700' :
          getInventoryLevelStatus(forecastStock, destination.min_quantity, destination.max_quantity) === '在庫少' ? 'bg-amber-100 text-amber-700' :
          getInventoryLevelStatus(forecastStock, destination.min_quantity, destination.max_quantity) === '在庫過多' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {getInventoryLevelStatus(forecastStock, destination.min_quantity, destination.max_quantity)}
        </div>
      </div>
    </td>
  );
})}
```

2. Remove the extra div elements that were causing syntax errors:

```javascript
// Remove these lines as they were causing syntax errors
<div className="text-xs text-blue-600 mb-1">合計</div>
<div className={`text-xs px-1 py-0.5 rounded ${
  getInventoryLevelStatus(totalStock, 
    Math.min(...product.customers.flatMap(c => c.destinations.map(d => d.min_quantity))), 
    Math.max(...product.customers.flatMap(c => c.destinations.map(d => d.max_quantity)))
  ) === '在庫切れ' ? 'bg-red-100 text-red-700' :
  getInventoryLevelStatus(totalStock, 
    Math.min(...product.customers.flatMap(c => c.destinations.map(d => d.min_quantity))), 
    Math.max(...product.customers.flatMap(c => c.destinations.map(d => d.max_quantity)))
    Math.min(...product.customers.flatMap(c => c.destinations.map(d => d.min_quantity))), 
    Math.max(...product.customers.flatMap(c => c.destinations.map(d => d.max_quantity)))
  )}
</div>
```

With these corrections, the file should now be properly formatted and all brackets should be properly closed.