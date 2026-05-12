import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type GroupPrivacy = Database['public']['Tables']['groups']['Row']['privacy']
type GroupAccess = {
  id: string
  privacy: GroupPrivacy
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if group exists and is public
    const { data: group } = await supabase
      .from('groups')
      .select('id, privacy')
      .eq('id', params.id)
      .single()

    const groupAccess = group as GroupAccess | null

    if (!groupAccess) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (groupAccess.privacy !== 'public') {
      return NextResponse.json(
        { error: 'This group is not public. Request to join instead.' },
        { status: 403 }
      )
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', params.id)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already a member' }, { status: 400 })
    }

    // Join group
    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: params.id,
        user_id: user.id,
        role: 'member'
      })

    if (error) {
      return NextResponse.json({ error: 'Failed to join group' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Join error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is the last admin
    const { data: membership } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Not a member' }, { status: 400 })
    }

    if (membership.role === 'admin') {
      // Check if there are other admins
      const { data: admins } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', params.id)
        .eq('role', 'admin')

      if (admins && admins.length <= 1) {
        return NextResponse.json(
          { error: 'Cannot leave: you are the only admin. Promote another member first.' },
          { status: 400 }
        )
      }
    }

    // Leave group
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', params.id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to leave group' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Leave error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
