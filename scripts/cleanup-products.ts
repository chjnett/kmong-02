
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vqlzwgsljcytqoqkznnq.supabase.co"
const supabaseAnonKey = "sb_publishable_Ihpno3Zz7RARxvb7OtX7rA_7hSGsuY3"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
    console.log('Fetching products...')
    // Fetch all products, newest first
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return
    }

    if (!products || products.length === 0) {
        console.log('No products found.')
        return
    }

    console.log(`Found ${products.length} products.`)

    if (products.length <= 1) {
        console.log('Only 1 or 0 products found. Nothing to delete.')
        return
    }

    // Keep the first one (index 0)
    const productToKeep = products[0]
    console.log(`Keeping product: ${productToKeep.name} (${productToKeep.id})`)

    // Delete the rest (index 1 and beyond)
    const productsToDelete = products.slice(1)
    const idsToDelete = productsToDelete.map(p => p.id)

    console.log(`Deleting ${idsToDelete.length} products...`)

    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', idsToDelete)

    if (deleteError) {
        console.error('Error deleting products:', deleteError)
    } else {
        console.log('Successfully deleted old products.')
    }
}

main()
