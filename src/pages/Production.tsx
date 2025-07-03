Here's the fixed version with all missing closing brackets and proper syntax:

```javascript
import React, { useState } from 'react';
import { CalendarDays, Plus, Filter, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Edit, ChevronLeft, ChevronRight, Package, FileText, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import { useProductionSchedule } from '../hooks/useProductionSchedule';
import { useInventory } from '../hooks/useInventory';
import { format, addDays, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

const Production: React.FC = () => {
  // ... [previous code remains the same until the missing brackets] ...

                    {/* 最低生産数行 */}
                    <tr className="bg-amber-50">
                      <td className="sticky left-0 z-10 bg-amber-50 px-4 py-3 whitespace-nowrap text-sm font-medium text-amber-800 border-r border-gray-200">
                        最低生産数
                      </td>
                      {dates.map((date) => {
                        const { minTarget } = getDailyTargets(date);
                        const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
                        return (
                          <td key={`min-target-${date}`} className={`px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-amber-800 ${
                            isWeekend ? 'bg-amber-100' : ''
                          }`}>
                            {minTarget > 0 ? minTarget.toLocaleString() : '-'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* 製品別生産予定 */}
                    {uniqueProducts.map((product) => (
                      <tr key={product?.product_id} className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                          <div>
                            <div className="font-medium">{product?.product_name}</div>
                            <div className="text-xs text-gray-500">{product?.product_id}</div>
                          </div>
                        </td>
                        {dates.map((date) => {
                          const dayData = scheduleData.find(s => s.date === date && s.product_id === product?.product_id);
                          return (
                            <td key={`${product?.product_id}-${date}`} className="px-4 py-3 whitespace-nowrap text-center text-sm">
                              {dayData && dayData.planned_quantity > 0 ? (
                                <div className="text-center">
                                  <span className="font-medium">{dayData.planned_quantity.toLocaleString()}</span>
                                </div>
                              ) : (
                                <div className="text-center text-gray-400 text-xs">
                                  休止
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* 月別合計行 */}
                    <tr className="bg-gray-50 font-medium">
                      <td className="sticky left-0 z-10 bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                        月別合計
                      </td>
                      {monthlyData.map((month) => {
                        const monthTotal = month.data.reduce((sum, product) => sum + product.total, 0);
                        const monthTarget = month.data.reduce((sum, product) => sum + product.target, 0);
                        const monthMinTarget = month.data.reduce((sum, product) => sum + product.minTarget, 0);
                        const targetAchievementRate = monthTarget > 0 ? (monthTotal / monthTarget) * 100 : 0;
                        const minTargetAchievementRate = monthMinTarget > 0 ? (monthTotal / monthMinTarget) * 100 : 0;
                        
                        return (
                          <td key={`total-${month.month}`} className={`px-6 py-4 whitespace-nowrap text-center text-sm ${month.isCurrentMonth ? 'bg-gray-100' : ''}`}>
                            <div className="space-y-1">
                              <div className="text-lg font-bold">
                                {monthTotal.toLocaleString()}
                              </div>
                              <div className="text-xs space-y-0.5">
                                <div className={`${targetAchievementRate >= 100 ? 'text-green-600' : targetAchievementRate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                                  目標達成率: {targetAchievementRate.toFixed(1)}%
                                </div>
                                <div className={`${minTargetAchievementRate >= 100 ? 'text-green-600' : minTargetAchievementRate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                                  最低達成率: {minTargetAchievementRate.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Production;
```