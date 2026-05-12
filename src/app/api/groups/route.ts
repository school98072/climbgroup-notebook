import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { name, description, privacy } = body

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create group
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name,
        description: description || null,
        privacy: privacy || 'public',
        created_by: user.id
      })
      .select()
      .single()

    if (groupError) {
      console.error('Create group error:', groupError)
      return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
    }

    // Add creator as admin member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'admin'
      })

    if (memberError) {
      console.error('Add member error:', memberError)
    }

    return NextResponse.json({ group })
  } catch (error) {
    console.error('Create group error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const privacy = searchParams.get('privacy')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('groups')
      .select(`
        *,
        profiles:created_by (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (privacy) {
      query = query.eq('privacy', privacy)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data: groups, error } = await query

    if (error) {
      console.error('Fetch groups error:', error)
      return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
    }

    // Get member counts for each group
    const { data: memberCounts } = await supabase
      .from('group_members')
      .select('group_id')

    const memberCountMap: Record<string, number> = {}
    memberCounts?.forEach(m => {
      memberCountMap[m.group_id] = (memberCountMap[m.group_id] || 0) + 1
    })

    const groupsWithCounts = groups?.map(g => ({
      ...g,
      member_count: memberCountMap[g.id] || 0
    }))

    return NextResponse.json({ groups: groupsWithCounts })
  } catch (error) {
    console.error('Fetch groups error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
