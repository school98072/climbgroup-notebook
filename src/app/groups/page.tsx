'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Header } from '@/components/layout/header'
import { GroupCard } from '@/components/groups/group-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  Users,
  MapPin,
  Loader2,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

// Mock data
const mockGroups = [
  {
    id: '1',
    name: 'Boulder Squad NYC',
    description: 'A community for boulderers in the NYC area. Share beta, organize sessions, and celebrate sends together.',
    avatar_url: null,
    privacy: 'public' as const,
    created_by: '1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Training Hub',
    description: 'Focused training discussions, hangboard routines, and technique drills.',
    avatar_url: null,
    privacy: 'public' as const,
    created_by: '2',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
  },
  {
    id: '3',
    name: 'V7+ Crew',
    description: 'Elite climbers pushing their limits. Private group for serious senders.',
    avatar_url: null,
    privacy: 'invite' as const,
    created_by: '1',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Outdoor Addicts',
    description: 'For those who chase the rock. Weekend trips, route planning, and outdoor beta.',
    avatar_url: null,
    privacy: 'public' as const,
    created_by: '3',
    created_at: '2024-01-12T00:00:00Z',
    updated_at: '2024-01-12T00:00:00Z',
  },
]

const myGroups = mockGroups.slice(0, 2)
const suggestedGroups = mockGroups.slice(2)

export default function GroupsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [newGroupPrivacy, setNewGroupPrivacy] = useState<'public' | 'private'>('public')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const filteredMyGroups = myGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSuggested = suggestedGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8 lg:pl-72">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Groups</h1>
            <p className="text-muted-foreground">
              Connect with fellow climbers and share your journey
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Group</DialogTitle>
                <DialogDescription>
                  Build a community around your climbing interests
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Group Name</label>
                  <Input
                    placeholder="Give your group a name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="What's your group about?"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Privacy</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="privacy"
                        checked={newGroupPrivacy === 'public'}
                        onChange={() => setNewGroupPrivacy('public')}
                      />
                      <span className="text-sm">Public</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="privacy"
                        checked={newGroupPrivacy === 'private'}
                        onChange={() => setNewGroupPrivacy('private')}
                      />
                      <span className="text-sm">Private</span>
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Create Group
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="my-groups" className="mb-8">
          <TabsList>
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="my-groups" className="mt-6">
            {filteredMyGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    memberCount={Math.floor(Math.random() * 200) + 50}
                    isMember={true}
                    onLeave={() => console.log('Leave group:', group.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No groups yet</p>
                <p className="text-sm mb-4">Join or create a group to connect with other climbers</p>
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Group
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            {filteredSuggested.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSuggested.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    memberCount={Math.floor(Math.random() * 200) + 10}
                    onJoin={() => console.log('Join group:', group.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No groups found matching your search</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Popular Tags */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['Bouldering', 'Sport Climbing', 'Training', 'Beginners', 'Outdoor', 'Competition', 'Gear', 'Nutrition', 'Technique', 'Beta'].map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
