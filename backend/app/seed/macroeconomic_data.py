"""Zimbabwe macroeconomic indicators 2018-2024.

Sources: ZIMSTAT, Reserve Bank of Zimbabwe, World Bank, IMF.
Values marked (est) are estimates based on published reports.
"""

MACRO_INDICATORS = [
    # GDP Growth Rate (%)
    {"indicator_name": "gdp_growth", "value": 4.8, "period": "2018-12-31", "source": "World Bank", "unit": "percent"},
    {"indicator_name": "gdp_growth", "value": -6.1, "period": "2019-12-31", "source": "World Bank", "unit": "percent"},
    {"indicator_name": "gdp_growth", "value": -7.4, "period": "2020-12-31", "source": "World Bank", "unit": "percent"},
    {"indicator_name": "gdp_growth", "value": 8.5, "period": "2021-12-31", "source": "World Bank", "unit": "percent"},
    {"indicator_name": "gdp_growth", "value": 6.5, "period": "2022-12-31", "source": "World Bank", "unit": "percent"},
    {"indicator_name": "gdp_growth", "value": 5.5, "period": "2023-12-31", "source": "ZIMSTAT", "unit": "percent"},
    {"indicator_name": "gdp_growth", "value": 3.5, "period": "2024-12-31", "source": "IMF (est)", "unit": "percent"},

    # Inflation Rate (annual average %)
    {"indicator_name": "inflation_rate", "value": 10.6, "period": "2018-12-31", "source": "ZIMSTAT", "unit": "percent"},
    {"indicator_name": "inflation_rate", "value": 255.3, "period": "2019-12-31", "source": "ZIMSTAT", "unit": "percent"},
    {"indicator_name": "inflation_rate", "value": 557.2, "period": "2020-12-31", "source": "ZIMSTAT", "unit": "percent"},
    {"indicator_name": "inflation_rate", "value": 98.5, "period": "2021-12-31", "source": "ZIMSTAT", "unit": "percent"},
    {"indicator_name": "inflation_rate", "value": 243.8, "period": "2022-12-31", "source": "ZIMSTAT", "unit": "percent"},
    {"indicator_name": "inflation_rate", "value": 101.3, "period": "2023-12-31", "source": "ZIMSTAT", "unit": "percent"},
    {"indicator_name": "inflation_rate", "value": 47.6, "period": "2024-12-31", "source": "RBZ (est)", "unit": "percent"},

    # FDI Inflows (USD millions)
    {"indicator_name": "fdi_inflow", "value": 745.0, "period": "2018-12-31", "source": "UNCTAD", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow", "value": 280.0, "period": "2019-12-31", "source": "UNCTAD", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow", "value": 194.0, "period": "2020-12-31", "source": "UNCTAD", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow", "value": 166.0, "period": "2021-12-31", "source": "UNCTAD", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow", "value": 352.0, "period": "2022-12-31", "source": "UNCTAD", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow", "value": 410.0, "period": "2023-12-31", "source": "UNCTAD (est)", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow", "value": 480.0, "period": "2024-12-31", "source": "ZIDA (est)", "unit": "usd_millions"},

    # Quarterly FDI Inflows 2023-2024
    {"indicator_name": "fdi_inflow_quarterly", "value": 85.0, "period": "2023-03-31", "source": "RBZ", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow_quarterly", "value": 110.0, "period": "2023-06-30", "source": "RBZ", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow_quarterly", "value": 105.0, "period": "2023-09-30", "source": "RBZ", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow_quarterly", "value": 110.0, "period": "2023-12-31", "source": "RBZ", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow_quarterly", "value": 100.0, "period": "2024-03-31", "source": "RBZ", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow_quarterly", "value": 125.0, "period": "2024-06-30", "source": "RBZ (est)", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow_quarterly", "value": 120.0, "period": "2024-09-30", "source": "RBZ (est)", "unit": "usd_millions"},
    {"indicator_name": "fdi_inflow_quarterly", "value": 135.0, "period": "2024-12-31", "source": "RBZ (est)", "unit": "usd_millions"},

    # Exchange Rate (ZWL per USD, official)
    {"indicator_name": "exchange_rate", "value": 1.0, "period": "2018-12-31", "source": "RBZ", "unit": "zwl_per_usd"},
    {"indicator_name": "exchange_rate", "value": 16.8, "period": "2019-12-31", "source": "RBZ", "unit": "zwl_per_usd"},
    {"indicator_name": "exchange_rate", "value": 81.8, "period": "2020-12-31", "source": "RBZ", "unit": "zwl_per_usd"},
    {"indicator_name": "exchange_rate", "value": 108.7, "period": "2021-12-31", "source": "RBZ", "unit": "zwl_per_usd"},
    {"indicator_name": "exchange_rate", "value": 684.3, "period": "2022-12-31", "source": "RBZ", "unit": "zwl_per_usd"},
    {"indicator_name": "exchange_rate", "value": 6300.0, "period": "2023-12-31", "source": "RBZ", "unit": "zwl_per_usd"},
    {"indicator_name": "exchange_rate", "value": 13500.0, "period": "2024-06-30", "source": "RBZ", "unit": "zwl_per_usd"},

    # Trade Balance (USD millions)
    {"indicator_name": "trade_balance", "value": -1524.0, "period": "2018-12-31", "source": "ZIMSTAT", "unit": "usd_millions"},
    {"indicator_name": "trade_balance", "value": 463.0, "period": "2019-12-31", "source": "ZIMSTAT", "unit": "usd_millions"},
    {"indicator_name": "trade_balance", "value": 1032.0, "period": "2020-12-31", "source": "ZIMSTAT", "unit": "usd_millions"},
    {"indicator_name": "trade_balance", "value": 596.0, "period": "2021-12-31", "source": "ZIMSTAT", "unit": "usd_millions"},
    {"indicator_name": "trade_balance", "value": 482.0, "period": "2022-12-31", "source": "ZIMSTAT", "unit": "usd_millions"},
    {"indicator_name": "trade_balance", "value": -320.0, "period": "2023-12-31", "source": "ZIMSTAT (est)", "unit": "usd_millions"},
    {"indicator_name": "trade_balance", "value": -280.0, "period": "2024-12-31", "source": "ZIMSTAT (est)", "unit": "usd_millions"},

    # Unemployment Rate (% - ILO estimate)
    {"indicator_name": "unemployment_rate", "value": 16.4, "period": "2018-12-31", "source": "World Bank", "unit": "percent"},
    {"indicator_name": "unemployment_rate", "value": 17.0, "period": "2019-12-31", "source": "World Bank", "unit": "percent"},
    {"indicator_name": "unemployment_rate", "value": 18.2, "period": "2020-12-31", "source": "World Bank", "unit": "percent"},
    {"indicator_name": "unemployment_rate", "value": 19.0, "period": "2021-12-31", "source": "World Bank (est)", "unit": "percent"},
    {"indicator_name": "unemployment_rate", "value": 18.5, "period": "2022-12-31", "source": "World Bank (est)", "unit": "percent"},
    {"indicator_name": "unemployment_rate", "value": 17.8, "period": "2023-12-31", "source": "ZIMSTAT (est)", "unit": "percent"},
    {"indicator_name": "unemployment_rate", "value": 16.9, "period": "2024-12-31", "source": "ZIMSTAT (est)", "unit": "percent"},

    # Ease of Doing Business Score (World Bank, 0-100)
    {"indicator_name": "ease_of_business", "value": 47.1, "period": "2018-12-31", "source": "World Bank", "unit": "score"},
    {"indicator_name": "ease_of_business", "value": 49.2, "period": "2019-12-31", "source": "World Bank", "unit": "score"},
    {"indicator_name": "ease_of_business", "value": 50.4, "period": "2020-12-31", "source": "World Bank", "unit": "score"},
    {"indicator_name": "ease_of_business", "value": 51.5, "period": "2021-12-31", "source": "World Bank (est)", "unit": "score"},
    {"indicator_name": "ease_of_business", "value": 52.8, "period": "2022-12-31", "source": "ZIDA (est)", "unit": "score"},
    {"indicator_name": "ease_of_business", "value": 54.2, "period": "2023-12-31", "source": "ZIDA (est)", "unit": "score"},
    {"indicator_name": "ease_of_business", "value": 55.8, "period": "2024-12-31", "source": "ZIDA (est)", "unit": "score"},
]
