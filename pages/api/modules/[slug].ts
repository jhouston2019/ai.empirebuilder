import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Canonical slug → filename mapping
const SLUG_TO_FILENAME: Record<string, string> = {
  foundation: 'Module 1 - Foundation.html',
  planning: 'Module 2 - Planning Your Empire.html',
  building: 'Module 3 - Building Your SaaS Tool.html',
  monetization: 'Module 4 - Monetization Mastery.html',
  traffic: 'Module 5 - Traffic & Growth.html',
  scaling: 'Module 6 - Scaling to Six Figures.html',
}

// Whitelist of allowed workbook filenames for safety
const ALLOWED_WORKBOOK_FILES = [
  'Module 1 - Workbook - Foundation.html',
  'Module 2 - Workbook - Planning Your Empire.html',
  'Module 3 - Workbook - Building Your SaaS Tool.html',
  'Module 4 - Workbook - Monetization Mastery.html',
  'Module 5 - Workbook - Traffic & Growth.html',
  'Module 6 - Workbook - Scaling to Six Figures.html',
]

// Safety validation: Check if filename is safe and allowed
function isValidWorkbookFile(filename: string): boolean {
  // Only allow .html files
  if (!filename.toLowerCase().endsWith('.html')) {
    return false
  }
  
  // Prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false
  }
  
  // Check if it's in the whitelist
  return ALLOWED_WORKBOOK_FILES.includes(filename)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug, file } = req.query
  const accessToken = req.cookies['sb-access-token']

  // Require authentication
  if (!accessToken) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  // Verify user and check plan
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  )

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (authError || !user || !user.email) {
      return res.status(401).json({ error: 'Invalid authentication' })
    }

    // Get user plan from database
    const { data: userData } = await supabase
      .from('users')
      .select('plan_tier')
      .eq('email', user.email)
      .single()

    const plan = userData?.plan_tier

    // CRITICAL: No access without a paid plan
    if (!plan || plan === '' || plan === 'none') {
      return res.status(403).json({ error: 'Access denied. You must purchase a plan to access this content.' })
    }

    let filename: string
    let isWorkbook = false

    // PHASE 1: Handle workbook files via query parameter
    if (file && typeof file === 'string') {
      // Validate workbook filename
      if (!isValidWorkbookFile(file)) {
        return res.status(400).json({ error: 'Invalid workbook filename' })
      }
      
      filename = file
      isWorkbook = true
    }
    // PHASE 1: Handle module slugs
    else if (slug && typeof slug === 'string') {
      // Get filename from slug
      filename = SLUG_TO_FILENAME[slug]
      if (!filename) {
        return res.status(404).send('Module not found')
      }

      // All paid plans (builder/pro/elite) have access to all modules
      const allowedSlugs = ['foundation', 'planning', 'building', 'monetization', 'traffic', 'scaling']

      // Check if user has access to this module
      if (!allowedSlugs.includes(slug)) {
        return res.status(403).json({ error: 'Access denied. Please purchase a plan to access this content.' })
      }
    } else {
      return res.status(400).json({ error: 'Invalid request. Provide either a slug or file parameter.' })
    }

    // Construct file path - read from /modules (source directory)
    const modulesDir = path.join(process.cwd(), 'modules')
    const filePath = path.join(modulesDir, filename)

    // PHASE 4: Safety validation - ensure file is within modules directory
    const resolvedPath = path.resolve(filePath)
    const resolvedModulesDir = path.resolve(modulesDir)
    
    if (!resolvedPath.startsWith(resolvedModulesDir)) {
      return res.status(403).json({ error: 'Access denied. Invalid file path.' })
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Resource not found')
    }

    // Determine content type
    const ext = path.extname(filename).toLowerCase()
    const contentType = ext === '.pdf' 
      ? 'application/pdf'
      : ext === '.html'
      ? 'text/html'
      : 'application/octet-stream'

    // Read and serve file
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
    res.setHeader('Cache-Control', 'private, max-age=3600')
    
    return res.status(200).send(fileContent)
  } catch (error) {
    console.error('Error serving module file:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

