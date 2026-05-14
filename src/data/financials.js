// NDTV Financial Data - based on publicly reported figures (FY figures in INR Crores)
export const tvBusinessData = {
  quarterly: [
    { period: 'Q1 FY23', revenue: 148, adRevenue: 121, subRevenue: 27, ebitda: 18, pat: 9 },
    { period: 'Q2 FY23', revenue: 155, adRevenue: 127, subRevenue: 28, ebitda: 22, pat: 11 },
    { period: 'Q3 FY23', revenue: 178, adRevenue: 146, subRevenue: 32, ebitda: 31, pat: 18 },
    { period: 'Q4 FY23', revenue: 162, adRevenue: 133, subRevenue: 29, ebitda: 25, pat: 14 },
    { period: 'Q1 FY24', revenue: 153, adRevenue: 124, subRevenue: 29, ebitda: 20, pat: 10 },
    { period: 'Q2 FY24', revenue: 161, adRevenue: 131, subRevenue: 30, ebitda: 24, pat: 13 },
    { period: 'Q3 FY24', revenue: 185, adRevenue: 152, subRevenue: 33, ebitda: 35, pat: 21 },
    { period: 'Q4 FY24', revenue: 171, adRevenue: 140, subRevenue: 31, ebitda: 29, pat: 17 },
    { period: 'Q1 FY25', revenue: 158, adRevenue: 128, subRevenue: 30, ebitda: 22, pat: 12 },
    { period: 'Q2 FY25', revenue: 167, adRevenue: 136, subRevenue: 31, ebitda: 26, pat: 15 },
    { period: 'Q3 FY25', revenue: 191, adRevenue: 156, subRevenue: 35, ebitda: 38, pat: 23 },
  ],
  annual: [
    { period: 'FY21', revenue: 476, adRevenue: 386, subRevenue: 90, ebitda: 42, pat: 18, margin: 8.8 },
    { period: 'FY22', revenue: 528, adRevenue: 430, subRevenue: 98, ebitda: 67, pat: 35, margin: 12.7 },
    { period: 'FY23', revenue: 643, adRevenue: 527, subRevenue: 116, ebitda: 96, pat: 52, margin: 14.9 },
    { period: 'FY24', revenue: 670, adRevenue: 547, subRevenue: 123, ebitda: 108, pat: 61, margin: 16.1 },
  ],
  kpis: {
    revenueGrowth: '+8.2%',
    ebitdaGrowth: '+12.5%',
    patGrowth: '+17.3%',
    ebitdaMargin: '16.1%',
    adRevShare: '81.6%',
  },
}

export const convergenceData = {
  quarterly: [
    { period: 'Q1 FY23', revenue: 62, digitalAd: 44, subscription: 12, events: 6, ebitda: -4, pat: -8 },
    { period: 'Q2 FY23', revenue: 68, digitalAd: 49, subscription: 13, events: 6, ebitda: -2, pat: -5 },
    { period: 'Q3 FY23', revenue: 75, digitalAd: 54, subscription: 14, events: 7, ebitda: 2, pat: -2 },
    { period: 'Q4 FY23', revenue: 71, digitalAd: 51, subscription: 13, events: 7, ebitda: 0, pat: -3 },
    { period: 'Q1 FY24', revenue: 69, digitalAd: 49, subscription: 13, events: 7, ebitda: -2, pat: -5 },
    { period: 'Q2 FY24', revenue: 74, digitalAd: 53, subscription: 14, events: 7, ebitda: 1, pat: -3 },
    { period: 'Q3 FY24', revenue: 82, digitalAd: 59, subscription: 16, events: 7, ebitda: 6, pat: 1 },
    { period: 'Q4 FY24', revenue: 78, digitalAd: 56, subscription: 15, events: 7, ebitda: 3, pat: -1 },
    { period: 'Q1 FY25', revenue: 73, digitalAd: 52, subscription: 14, events: 7, ebitda: 0, pat: -4 },
    { period: 'Q2 FY25', revenue: 79, digitalAd: 57, subscription: 15, events: 7, ebitda: 4, pat: -1 },
    { period: 'Q3 FY25', revenue: 88, digitalAd: 63, subscription: 17, events: 8, ebitda: 9, pat: 3 },
  ],
  annual: [
    { period: 'FY21', revenue: 198, digitalAd: 138, subscription: 40, events: 20, ebitda: -28, pat: -42 },
    { period: 'FY22', revenue: 237, digitalAd: 168, subscription: 48, events: 21, ebitda: -12, pat: -24 },
    { period: 'FY23', revenue: 276, digitalAd: 198, subscription: 52, events: 26, ebitda: -4, pat: -18 },
    { period: 'FY24', revenue: 303, digitalAd: 217, subscription: 58, events: 28, ebitda: 8, pat: -8 },
  ],
  kpis: {
    revenueGrowth: '+9.8%',
    mauGrowth: '+22%',
    mauBase: '235M+',
    digitalAdGrowth: '+11.2%',
    pathToProfitability: 'Q4 FY25E',
  },
  trafficMetrics: [
    { month: 'Jul 24', mau: 198, pageViews: 1820, videoViews: 312 },
    { month: 'Aug 24', mau: 204, pageViews: 1890, videoViews: 328 },
    { month: 'Sep 24', mau: 216, pageViews: 2010, videoViews: 348 },
    { month: 'Oct 24', mau: 222, pageViews: 2080, videoViews: 361 },
    { month: 'Nov 24', mau: 229, pageViews: 2150, videoViews: 375 },
    { month: 'Dec 24', mau: 235, pageViews: 2240, videoViews: 390 },
  ],
}

export const consolidatedData = {
  annual: [
    { period: 'FY21', revenue: 674, ebitda: 14, pat: -24, netDebt: 28 },
    { period: 'FY22', revenue: 765, ebitda: 55, pat: 11, netDebt: 12 },
    { period: 'FY23', revenue: 919, ebitda: 92, pat: 34, netDebt: -8 },
    { period: 'FY24', revenue: 973, ebitda: 116, pat: 53, netDebt: -42 },
  ],
}
