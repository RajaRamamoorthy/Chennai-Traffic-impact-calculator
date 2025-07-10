#!/bin/bash

# Chennai Traffic Impact Calculator - API Usage Monitor
# This script checks the current Google Maps API usage and estimated costs

# Configuration
API_URL="${API_URL:-http://localhost:5000}"
ADMIN_KEY="${ADMIN_API_KEY}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "========================================"
echo "Chennai Traffic Calculator - API Monitor"
echo "========================================"
echo ""

# Check if admin key is provided
if [ -z "$ADMIN_KEY" ]; then
    echo -e "${RED}Error: ADMIN_API_KEY environment variable not set${NC}"
    echo "Usage: ADMIN_API_KEY=your-key ./check-api-usage.sh"
    exit 1
fi

# Fetch API usage data
echo "Fetching API usage data..."
RESPONSE=$(curl -s -H "x-admin-key: $ADMIN_KEY" "$API_URL/api/admin/api-usage")

# Check if request was successful
if [ $? -ne 0 ] || [ -z "$RESPONSE" ]; then
    echo -e "${RED}Error: Failed to fetch API usage data${NC}"
    exit 1
fi

# Check for forbidden response
if echo "$RESPONSE" | grep -q "Forbidden"; then
    echo -e "${RED}Error: Invalid admin key${NC}"
    exit 1
fi

# Parse and display the response using jq if available
if command -v jq &> /dev/null; then
    echo -e "${GREEN}API Usage Statistics:${NC}"
    echo ""
    
    # Extract data using jq
    TOTAL_CALLS=$(echo "$RESPONSE" | jq -r '.summary.totalAPICalls')
    CACHE_RATE=$(echo "$RESPONSE" | jq -r '.summary.cacheHitRate')
    TOTAL_COST=$(echo "$RESPONSE" | jq -r '.estimatedCosts.total')
    
    echo "📊 Summary:"
    echo "  Total API Calls: $TOTAL_CALLS"
    echo "  Cache Hit Rate: $CACHE_RATE"
    echo "  Estimated Cost: $TOTAL_COST"
    echo ""
    
    echo "📍 Breakdown by API:"
    echo "  Autocomplete:"
    echo "    - Calls: $(echo "$RESPONSE" | jq -r '.usage.autocomplete.calls')"
    echo "    - Cache Hits: $(echo "$RESPONSE" | jq -r '.usage.autocomplete.cacheHits')"
    echo "    - Cost: $(echo "$RESPONSE" | jq -r '.estimatedCosts.autocomplete')"
    echo ""
    echo "  Geocoding:"
    echo "    - Calls: $(echo "$RESPONSE" | jq -r '.usage.geocoding.calls')"
    echo "    - Cache Hits: $(echo "$RESPONSE" | jq -r '.usage.geocoding.cacheHits')"
    echo "    - Cost: $(echo "$RESPONSE" | jq -r '.estimatedCosts.geocoding')"
    echo ""
    echo "  Directions:"
    echo "    - Calls: $(echo "$RESPONSE" | jq -r '.usage.directions.calls')"
    echo "    - Cache Hits: $(echo "$RESPONSE" | jq -r '.usage.directions.cacheHits')"
    echo "    - Cost: $(echo "$RESPONSE" | jq -r '.estimatedCosts.directions')"
    echo ""
    
    # Warning if costs are high
    COST_NUM=$(echo "$TOTAL_COST" | sed 's/\$//g')
    if (( $(echo "$COST_NUM > 10" | bc -l) )); then
        echo -e "${YELLOW}⚠️  Warning: Daily costs exceed $10${NC}"
    fi
    
else
    # Fallback without jq
    echo -e "${GREEN}API Usage Response:${NC}"
    echo "$RESPONSE"
    echo ""
    echo -e "${YELLOW}Note: Install 'jq' for formatted output${NC}"
fi

echo ""
echo "Last checked: $(date)"
echo "========================================"