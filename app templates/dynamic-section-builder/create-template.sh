#!/bin/bash

# Dynamic Section Builder - Template Creation Script
# This script copies and adapts files from Power Solar to create the generic template

echo "🚀 Creating Dynamic Section Builder template..."

SRC_DIR="../apps/frontend/src"
DEST_DIR="src"

# Function to create file with sed replacements
adapt_file() {
  local src=$1
  local dest=$2
  echo "  Adapting: $dest"
  
  # Copy and make generic replacements
  cat "$src" | \
    sed 's/PowerSolar/YourCompany/g' | \
    sed 's/Power Solar/Your Company/g' | \
    sed 's/powersolar/yourcompany/g' | \
    sed "s/087-0644982/+1-555-0100/g" | \
    sed 's/info@powersolar.ie/hello@yourcompany.com/g' | \
    sed 's/Dublin & All of Leinster/City, State/g' | \
    sed 's/PowerSolarSection/Section/g' | \
    sed 's/powersolar-variants/dsb-variants/g' \
    > "$dest"
}

# Create core system files
echo "📦 Copying core system files..."
mkdir -p $DEST_DIR/contexts
mkdir -p $DEST_DIR/components  
mkdir -p $DEST_DIR/config
mkdir -p $DEST_DIR/pages
mkdir -p $DEST_DIR/i18n
mkdir -p $DEST_DIR/locales/en

adapt_file "$SRC_DIR/contexts/VariantContext.tsx" "$DEST_DIR/contexts/VariantContext.tsx"
adapt_file "$SRC_DIR/config/variants.ts" "$DEST_DIR/config/variants.ts"
adapt_file "$SRC_DIR/components/DevToolbar.tsx" "$DEST_DIR/components/DevToolbar.tsx"
adapt_file "$SRC_DIR/components/ThemeWrapper.tsx" "$DEST_DIR/components/ThemeWrapper.tsx"
adapt_file "$SRC_DIR/App.css" "$DEST_DIR/App.css"
adapt_file "$SRC_DIR/App.tsx" "$DEST_DIR/App.tsx"
adapt_file "$SRC_DIR/main.tsx" "$DEST_DIR/main.tsx"

echo "✅ Template structure created!"
echo ""
echo "⚠️  Manual steps required:"
echo "  1. Update section names in VariantContext.tsx"
echo "  2. Create variant files for each section"
echo "  3. Update i18n JSON files with generic content"
echo "  4. Test: npm install && npm run dev"
echo ""
echo "📚 See COPY_FILES.md for detailed instructions"

