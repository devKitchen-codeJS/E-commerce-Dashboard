'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useRealtimeEvents_1 = require("@/lib/hooks/useRealtimeEvents");
var useEventGenerator_1 = require("@/lib/hooks/useEventGenerator");
var eventGenerator_1 = require("@/lib/eventGenerator");
var utils_1 = require("@/lib/utils");
var KPICard_1 = require("@/components/dashboard/KPICard");
var EventFeed_1 = require("@/components/dashboard/EventFeed");
var FunnelChart_1 = require("@/components/dashboard/FunnelChart");
var TopProducts_1 = require("@/components/dashboard/TopProducts");
var ActivityChart_1 = require("@/components/dashboard/ActivityChart");
var GeneratorBar_1 = require("@/components/dashboard/GeneratorBar");
function DashboardPage() {
    var _a = useRealtimeEvents_1.useRealtimeEvents(10), events = _a.events, connected = _a.connected;
    var _b = useEventGenerator_1.useEventGenerator(), running = _b.running, count = _b.count, error = _b.error, toggle = _b.toggle;
    var kpis = react_1.useMemo(function () { return eventGenerator_1.calculateKPIs(events); }, [events]);
    var funnel = react_1.useMemo(function () { return eventGenerator_1.calculateFunnel(events); }, [events]);
    var products = react_1.useMemo(function () { return eventGenerator_1.calculateTopProducts(events); }, [events]);
    return (React.createElement("div", { className: "flex flex-col gap-5 p-6" },
        React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("div", null,
                React.createElement("h1", { className: "text-lg font-semibold text-white/90" }, "Dashboard"),
                React.createElement("p", { className: "text-xs text-white/30" }, "Last 10 minutes of activity"))),
        React.createElement(GeneratorBar_1.GeneratorBar, { running: running, count: count, error: error, onToggle: toggle }),
        React.createElement("div", { className: "grid grid-cols-4 gap-4" },
            React.createElement(KPICard_1.KPICard, { label: "Active Users", value: kpis.activeUsers.toString(), icon: lucide_react_1.Users, iconColor: "text-blue-400", description: "Unique sessions (last 5 min)" }),
            React.createElement(KPICard_1.KPICard, { label: "Revenue", value: utils_1.formatCurrency(kpis.revenue), icon: lucide_react_1.DollarSign, iconColor: "text-emerald-400", description: "From purchases this window" }),
            React.createElement(KPICard_1.KPICard, { label: "Conversion Rate", value: kpis.conversionRate + "%", icon: lucide_react_1.TrendingUp, iconColor: "text-indigo-400", description: "Purchases / Page views" }),
            React.createElement(KPICard_1.KPICard, { label: "Events / min", value: kpis.eventsPerMinute.toString(), icon: lucide_react_1.Activity, iconColor: "text-amber-400", description: "Events in the last 60 seconds" })),
        React.createElement("div", { className: "grid grid-cols-3 gap-4" },
            React.createElement("div", { className: "col-span-2" },
                React.createElement(EventFeed_1.EventFeed, { events: events, connected: connected })),
            React.createElement(TopProducts_1.TopProducts, { products: products.map(function (p) { var _a; return (__assign(__assign({}, p), { name: (_a = p.name) !== null && _a !== void 0 ? _a : p.product_id })); }) })),
        React.createElement("div", { className: "grid grid-cols-2 gap-4" },
            React.createElement(FunnelChart_1.FunnelChart, { data: funnel }),
            React.createElement(ActivityChart_1.ActivityChart, { events: events }))));
}
exports["default"] = DashboardPage;
