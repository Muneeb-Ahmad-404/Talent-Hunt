import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function forward(request: NextRequest, path: string[]) {
  const target = `${process.env.API_URL}/api/${path.join('/')}${request.nextUrl.search}`
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value
  const body = request.method === 'GET' || request.method === 'DELETE' ? undefined : await request.text()
  const headers = new Headers({ Accept: 'application/json' })

  if (body) headers.set('Content-Type', request.headers.get('content-type') ?? 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  const response = await fetch(target, { method: request.method, headers, body, cache: 'no-store' })
  const responseBody = await response.text()
  const result = new NextResponse(responseBody, { status: response.status })
  const contentType = response.headers.get('content-type')
  if (contentType) result.headers.set('content-type', contentType)
  return result
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path)
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path)
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return forward(request, (await context.params).path)
}

export const runtime = 'nodejs'
