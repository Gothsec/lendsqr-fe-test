import { NextResponse } from 'next/server'
import { getUsers } from '@/lib/data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 10))
  const org = searchParams.get('org')
  const status = searchParams.get('status')
  const search = searchParams.get('search')?.toLowerCase()

  let result = getUsers()

  if (org) result = result.filter(u => u.orgName.toLowerCase() === org.toLowerCase())
  if (status) result = result.filter(u => u.status === status)
  if (search) {
    result = result.filter(u =>
      u.userName.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.phoneNumber.includes(search) ||
      u.orgName.toLowerCase().includes(search)
    )
  }

  const total = result.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const items = result.slice(start, start + limit)

  return NextResponse.json({ items, total, page, totalPages })
}
