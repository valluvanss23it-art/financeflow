import { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, ExternalLink, Calendar, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  content?: string;
  source: string;
  category: 'market' | 'economy' | 'stocks' | 'crypto' | 'commodities' | 'general';
  imageUrl?: string;
  articleUrl?: string;
  publishedAt: string;
}

interface NewsResponse {
  success: boolean;
  data: NewsArticle[];
  pagination?: {
    total: number;
    limit: number;
    skip: number;
  };
}

// Mock financial data - Replace with real API calls
const mockFinancialData = {
  gold: {
    '24k': { price: 7240, change: 45, changePercent: 0.63 },
    '22k': { price: 6640, change: 40, changePercent: 0.61 },
    '18k': { price: 5430, change: 35, changePercent: 0.65 },
    per10g: 7240,
    lastUpdated: new Date(Date.now() - 5 * 60000),
    location: 'India'
  },
  silver: {
    price: 92500,
    change: 850,
    changePercent: 0.93,
    unit: 'per kg',
    lastUpdated: new Date(Date.now() - 5 * 60000)
  },
  currency: {
    usd: { rate: 83.45, change: 0.15, changePercent: 0.18 },
    eur: { rate: 91.23, change: -0.45, changePercent: -0.49 },
    gbp: { rate: 105.67, change: 0.35, changePercent: 0.33 },
    lastUpdated: new Date(Date.now() - 2 * 60000)
  },
  indices: {
    nifty50: { value: 23456.75, change: 125.45, changePercent: 0.54 },
    sensex: { value: 77892.35, change: 285.60, changePercent: 0.37 },
    lastUpdated: new Date(Date.now() - 1 * 60000)
  },
  crypto: {
    bitcoin: { price: 96543.21, change: 2341.5, changePercent: 2.49 },
    ethereum: { price: 3567.89, change: 125.67, changePercent: 3.65 },
    lastUpdated: new Date(Date.now() - 60000)
  },
  commodities: {
    brentCrude: { price: 87.45, change: 1.23, changePercent: 1.43 },
    wtiCrude: { price: 82.15, change: 0.89, changePercent: 1.09 },
    lastUpdated: new Date(Date.now() - 3 * 60000)
  },
  interestRates: {
    rbiRepo: 6.5,
    bankFDAvg: 7.2,
    lastUpdated: new Date(Date.now() - 24 * 60 * 60000)
  },
  topGainers: [
    { name: 'RELIANCE', price: 2845.50, change: 125.30, changePercent: 4.62 },
    { name: 'HDFC', price: 1890.25, change: 98.45, changePercent: 5.48 },
    { name: 'INFY', price: 1645.80, change: 75.20, changePercent: 4.78 }
  ],
  topLosers: [
    { name: 'MARUTI', price: 9245.75, change: -345.50, changePercent: -3.60 },
    { name: 'BAJAJ-AUTO', price: 7890.10, change: -234.20, changePercent: -2.88 },
    { name: 'TATA STEEL', price: 3456.45, change: -156.75, changePercent: -4.35 }
  ]
};

export function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNewsByCategory('general');
  }, [news]);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/news?limit=50&sort=-publishedAt');
      const data: NewsResponse = response.data;
      
      if (data.success) {
        setNews(data.data);
      }
    } catch (error: any) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNews = async () => {
    try {
      setIsRefreshing(true);
      const response = await api.post('/news/refresh');
      
      if (response.data.success) {
        toast({
          title: 'Refreshed',
          description: response.data.message,
        });
        await fetchNews();
      }
    } catch (error: any) {
      console.error('Error refreshing news:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filterNewsByCategory = (category: string) => {
    if (category === 'general' || category === 'all') {
      setFilteredNews(news.slice(0, 10));
    } else {
      setFilteredNews(news.filter(article => article.category === category).slice(0, 10));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const PriceCard = ({ label, value, change, changePercent, unit = '₹' }: any) => (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold">{unit}{typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : value}</p>
          {unit && <p className="text-xs text-muted-foreground mt-1">{unit}</p>}
        </div>
        <div className={`text-right ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <div className="flex items-center gap-1 justify-end">
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-semibold">{change >= 0 ? '+' : ''}{change?.toFixed(2)}</span>
          </div>
          <p className="text-xs">{changePercent >= 0 ? '+' : ''}{changePercent?.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Financial Dashboard"
          description="Live market data, news updates, and financial insights"
          icon={<Newspaper className="w-8 h-8" />}
        />

        {/* Header with Refresh */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Market Overview</h2>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString('en-IN')}</p>
          </div>
          <Button onClick={refreshNews} disabled={isRefreshing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="commodities">Commodities</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Daily Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Daily Market Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Market</p>
                    <p className="text-2xl font-bold text-green-600">📈 Up 0.54%</p>
                    <p className="text-xs text-muted-foreground">NIFTY 50 leading</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gold Price</p>
                    <p className="text-2xl font-bold text-yellow-600">₹7,240</p>
                    <p className="text-xs text-muted-foreground">+0.63% today</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">USD/INR</p>
                    <p className="text-2xl font-bold">₹83.45</p>
                    <p className="text-xs text-muted-foreground">+0.18% vs yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CORE: Gold Prices */}
            <Card>
              <CardHeader>
                <CardTitle>💰 Gold Prices</CardTitle>
                <CardDescription>Per 10g (Location: India)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PriceCard 
                    label="24K Gold" 
                    value={mockFinancialData.gold['24k'].price}
                    change={mockFinancialData.gold['24k'].change}
                    changePercent={mockFinancialData.gold['24k'].changePercent}
                  />
                  <PriceCard 
                    label="22K Gold" 
                    value={mockFinancialData.gold['22k'].price}
                    change={mockFinancialData.gold['22k'].change}
                    changePercent={mockFinancialData.gold['22k'].changePercent}
                  />
                  <PriceCard 
                    label="18K Gold" 
                    value={mockFinancialData.gold['18k'].price}
                    change={mockFinancialData.gold['18k'].change}
                    changePercent={mockFinancialData.gold['18k'].changePercent}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-4">Updated: {formatTime(mockFinancialData.gold.lastUpdated)}</p>
              </CardContent>
            </Card>

            {/* CORE: Silver & Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Silver */}
              <Card>
                <CardHeader>
                  <CardTitle>🥈 Silver Price</CardTitle>
                  <CardDescription>Per kg rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Current Price</span>
                      <span className="text-2xl font-bold">₹{mockFinancialData.silver.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                      <span>Change</span>
                      <span className="text-lg font-semibold">+₹{mockFinancialData.silver.change} (+{mockFinancialData.silver.changePercent.toFixed(2)}%)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Updated: {formatTime(mockFinancialData.silver.lastUpdated)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Currency */}
              <Card>
                <CardHeader>
                  <CardTitle>💱 Currency Exchange</CardTitle>
                  <CardDescription>vs INR</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>USD → INR</span>
                      <div className="text-right">
                        <p className="font-bold">₹{mockFinancialData.currency.usd.rate.toFixed(2)}</p>
                        <p className="text-xs text-green-600">+{mockFinancialData.currency.usd.changePercent.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>EUR → INR</span>
                      <div className="text-right">
                        <p className="font-bold">₹{mockFinancialData.currency.eur.rate.toFixed(2)}</p>
                        <p className="text-xs text-red-600">{mockFinancialData.currency.eur.changePercent.toFixed(2)}%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>GBP → INR</span>
                      <div className="text-right">
                        <p className="font-bold">₹{mockFinancialData.currency.gbp.rate.toFixed(2)}</p>
                        <p className="text-xs text-green-600">+{mockFinancialData.currency.gbp.changePercent.toFixed(2)}%</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Updated: {formatTime(mockFinancialData.currency.lastUpdated)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CORE: Stock Market Indices */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Stock Market Indices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">NIFTY 50</p>
                    <p className="text-3xl font-bold">{mockFinancialData.indices.nifty50.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">+{mockFinancialData.indices.nifty50.change.toFixed(2)} ({mockFinancialData.indices.nifty50.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">SENSEX</p>
                    <p className="text-3xl font-bold">{mockFinancialData.indices.sensex.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">+{mockFinancialData.indices.sensex.change.toFixed(2)} ({mockFinancialData.indices.sensex.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Updated: {formatTime(mockFinancialData.indices.lastUpdated)}</p>
              </CardContent>
            </Card>

            {/* Interest Rates */}
            <Card>
              <CardHeader>
                <CardTitle>🏦 Interest Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-muted-foreground">RBI Repo Rate</p>
                    <p className="text-3xl font-bold text-blue-600">{mockFinancialData.interestRates.rbiRepo}%</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-muted-foreground">Bank FD Rate (Avg)</p>
                    <p className="text-3xl font-bold text-green-600">{mockFinancialData.interestRates.bankFDAvg}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMMODITIES TAB */}
          <TabsContent value="commodities">
            <Card>
              <CardHeader>
                <CardTitle>🛢️ Crude Oil Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Brent Crude</p>
                    <p className="text-2xl font-bold">${mockFinancialData.commodities.brentCrude.price.toFixed(2)}/bbl</p>
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">+{mockFinancialData.commodities.brentCrude.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">WTI Crude</p>
                    <p className="text-2xl font-bold">${mockFinancialData.commodities.wtiCrude.price.toFixed(2)}/bbl</p>
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">+{mockFinancialData.commodities.wtiCrude.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CRYPTO TAB */}
          <TabsContent value="crypto">
            <Card>
              <CardHeader>
                <CardTitle>🪙 Cryptocurrency Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Bitcoin', symbol: '₿', ...mockFinancialData.crypto.bitcoin },
                    { name: 'Ethereum', symbol: 'Ξ', ...mockFinancialData.crypto.ethereum }
                  ].map((crypto: any) => (
                    <div key={crypto.name} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{crypto.name}</p>
                        <p className="text-2xl font-bold">${crypto.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                      </div>
                      <div className={`text-right ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div className="flex items-center gap-1 justify-end">
                          {crypto.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>
                        <p className="font-semibold">{crypto.change >= 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%</p>
                        <p className="text-xs">24h change</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STOCKS TAB */}
          <TabsContent value="stocks" className="space-y-4">
            {/* Top Gainers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">📈 Top Gainers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockFinancialData.topGainers.map((stock: any) => (
                    <div key={stock.name} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-semibold">{stock.name}</p>
                        <p className="text-sm text-muted-foreground">₹{stock.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right text-green-600">
                        <p className="font-semibold">+{stock.changePercent.toFixed(2)}%</p>
                        <p className="text-xs">+₹{stock.change.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Losers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">📉 Top Losers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockFinancialData.topLosers.map((stock: any) => (
                    <div key={stock.name} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-semibold">{stock.name}</p>
                        <p className="text-sm text-muted-foreground">₹{stock.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right text-red-600">
                        <p className="font-semibold">{stock.changePercent.toFixed(2)}%</p>
                        <p className="text-xs">₹{stock.change.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NEWS TAB */}
          <TabsContent value="news">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin">
                    <RefreshCw className="w-8 h-8 text-primary" />
                  </div>
                  <p className="mt-4 text-muted-foreground">Loading news articles...</p>
                </div>
              ) : filteredNews.length === 0 ? (
                <Card>
                  <CardHeader className="text-center py-12">
                    <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle>No News Available</CardTitle>
                    <CardDescription>No news articles found.</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredNews.map(article => (
                    <Card key={article._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
                            <CardDescription className="text-xs mt-2 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(article.publishedAt).toLocaleDateString()} • {article.source}
                            </CardDescription>
                          </div>
                          <Badge className="flex-shrink-0">{article.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.description}</p>
                        {article.articleUrl && (
                          <a
                            href={article.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm flex items-center gap-1 w-fit"
                          >
                            Read Full Article <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="text-center py-4 text-xs text-muted-foreground border-t">
          <p>Last Updated: {new Date().toLocaleString('en-IN')} | Data from multiple sources | For informational purposes only</p>
        </div>
      </div>
    </Layout>
  );
}
