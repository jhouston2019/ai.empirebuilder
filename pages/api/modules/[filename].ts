import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { filename } = req.query
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

    // Validate filename to prevent path traversal
    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({ error: 'Invalid filename' })
    }

    // Only allow safe filenames (alphanumeric, spaces, hyphens, underscores, dots)
    if (!/^[a-zA-Z0-9\s\-_.]+$/.test(filename)) {
      return res.status(400).json({ error: 'Invalid filename format' })
    }

    // Determine which modules the user can access based on their paid plan
    const allowedModules = plan === 'starter' 
      ? ['Module 1 - Foundation', 'Module 2 - Planning Your Empire']
      : ['Module 1 - Foundation', 'Module 2 - Planning Your Empire', 'Module 3 - Building Your SaaS Tool', 'Module 4 - Monetization Mastery', 'Module 5 - Traffic & Growth', 'Module 6 - Scaling to Six Figures']

    // Check if user has access to this module
    const hasAccess = allowedModules.some(moduleName => 
      filename.includes(moduleName)
    )

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied. Upgrade your plan to access this content.' })
    }

    // Construct file path
    const filePath = path.join(process.cwd(), 'public', 'modules', filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    // Determine content type
    const ext = path.extname(filename).toLowerCase()
    const contentType = ext === '.pdf' 
      ? 'application/pdf'
      : ext === '.html'
      ? 'text/html'
      : 'application/octet-stream'

    // Read and serve file
    const fileContent = fs.readFileSync(filePath)
    
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
    res.setHeader('Cache-Control', 'private, max-age=3600')
    
    return res.send(fileContent)
  } catch (error) {
    console.error('Error serving module file:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

