// src/components/profile/ImpactSummary.js
import { Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ImpactSummary({ stats }) {
  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Environmental Impact
        </CardTitle>
        <CardDescription>Your contribution to the community</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-primary mb-1">{stats?.trees_planted || 0}</div>
            <p className="text-sm text-muted-foreground">Trees Planted</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">150 lbs</div>
            <p className="text-sm text-muted-foreground">Waste Removed</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-1">12 tons</div>
            <p className="text-sm text-muted-foreground">CO₂ Offset/Year</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}