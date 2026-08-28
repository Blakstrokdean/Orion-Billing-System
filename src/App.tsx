import { useEffect, useState } from 'react'
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Ban, Bell, CheckCircle2, ChevronDown,
  CircleDollarSign, Clock3, Cpu, CreditCard, Database, Download, ExternalLink, Gauge, HardDrive,
  Infinity, Key, Laptop, LayoutDashboard, LifeBuoy, LogOut, MessageSquare, Moon, MoreHorizontal,
  Network, Phone, Play, Plus, Radio, ReceiptText, RefreshCw, Router, Search, Send, Server,
  Settings2, ShieldAlert, ShieldCheck, Signal, Smartphone, Sparkles, Sun, Tablet, Ticket,
  ToggleLeft, ToggleRight, Trash2, UserCheck, UserPlus, Users, UserX, Wifi, WifiOff, X, Zap,
} from 'lucide-react'
import { supabase, getSupabaseConfig, setSupabaseConfig } from './lib/supabase'
import { useTheme } from './useTheme'

type Session = { id?: string; name: string; device: string; location: string; plan: string; usage: string; progress: number; color: string }
type Transaction = { id: string; customer: string; method: string; package: string; amount: string; status: string; time: string }
type PackageItem = { id?: string; name: string; sales: string; amount: string; width: string; color: string }
type RouterItem = { id?: string; name: string; value: string; status: string }

export type RouterDevice = {
  id: string
  name: string
  ip_address: string
  model: string
  location: string
  status: 'good' | 'warn' | 'down'
  clients_count: number
  traffic_down: string
  traffic_up: string
  cpu_load: number
  ram_load: number
  ping_ms: number
  uptime: string
}

export type CustomerRecord = {
  id: string
  name: string
  phone: string
  device: string
  plan: string
  total_spent: string
  data_usage: string
  status: 'active' | 'idle' | 'blocked'
  last_active: string
  avatar_color: string
}

export type HotspotPackage = {
  id: string
  name: string
  category: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'multi-device'
  price: number
  duration_display: string
  data_limit: string
  speed_limit: string
  device_limit: number
  sales_count: number
  is_active: boolean
  color: string
}

const initialSessions: Session[] = [
  { name: 'Maya Ochieng', device: 'iPhone 14 Pro', location: 'Lobby AP · 10.20.0.34', plan: '24 hour pass', usage: '1.2 GB / 5 GB', progress: 24, color: '#d36b4d' },
  { name: 'Brian Kamau', device: 'MacBook Air', location: 'Poolside AP · 10.20.0.52', plan: '7 day access', usage: '8.4 GB / 20 GB', progress: 42, color: '#317d75' },
  { name: 'Aisha Wanjiku', device: 'Galaxy S24', location: 'Cafe AP · 10.20.1.18', plan: '1 hour pass', usage: '680 MB / 1 GB', progress: 68, color: '#c58a32' },
]

const initialTransactions: Transaction[] = [
  { id: '#TRX-2091', customer: 'Maya Ochieng', method: 'M-Pesa', package: '24 hour pass', amount: 'KSh 250', status: 'Paid', time: 'Today, 09:42' },
  { id: '#TRX-2090', customer: 'Peter Mwangi', method: 'Voucher', package: '1 hour pass', amount: 'KSh 50', status: 'Paid', time: 'Today, 09:26' },
  { id: '#TRX-2089', customer: 'Grace Njeri', method: 'M-Pesa', package: '7 day access', amount: 'KSh 1,200', status: 'Paid', time: 'Today, 08:58' },
  { id: '#TRX-2088', customer: 'Samuel Kibet', method: 'Airtel Money', package: '5 GB data', amount: 'KSh 500', status: 'Pending', time: 'Today, 08:44' },
]

const initialPackagesList: HotspotPackage[] = [
  {
    id: 'pkg-1',
    name: '1 Hour Unlimited Rush',
    category: 'hourly',
    price: 70,
    duration_display: '1 Hour',
    data_limit: 'Unlimited',
    speed_limit: '10 Mbps',
    device_limit: 1,
    sales_count: 312,
    is_active: true,
    color: 'yellow',
  },
  {
    id: 'pkg-2',
    name: '24h Day Pass Unlimited',
    category: 'daily',
    price: 350,
    duration_display: '24 Hours (1 Day)',
    data_limit: 'Unlimited',
    speed_limit: '20 Mbps',
    device_limit: 1,
    sales_count: 584,
    is_active: true,
    color: 'orange',
  },
  {
    id: 'pkg-3',
    name: '7 Days Unlimited Flex',
    category: 'weekly',
    price: 1500,
    duration_display: '7 Days (1 Week)',
    data_limit: 'Unlimited',
    speed_limit: '25 Mbps',
    device_limit: 1,
    sales_count: 148,
    is_active: true,
    color: 'teal',
  },
  {
    id: 'pkg-4',
    name: '30 Days Monthly Unlimited Pro',
    category: 'monthly',
    price: 3500,
    duration_display: '30 Days (1 Month)',
    data_limit: 'Unlimited',
    speed_limit: '30 Mbps',
    device_limit: 1,
    sales_count: 86,
    is_active: true,
    color: 'green',
  },
  {
    id: 'pkg-5',
    name: 'Duo 2-Devices 24h Unlimited',
    category: 'multi-device',
    price: 500,
    duration_display: '24 Hours',
    data_limit: 'Unlimited Shared',
    speed_limit: '20 Mbps',
    device_limit: 2,
    sales_count: 112,
    is_active: true,
    color: 'orange',
  },
  {
    id: 'pkg-6',
    name: 'Family & Team 4-Devices 30d Unlimited',
    category: 'multi-device',
    price: 6500,
    duration_display: '30 Days (1 Month)',
    data_limit: 'Unlimited Shared',
    speed_limit: '50 Mbps Turbo',
    device_limit: 4,
    sales_count: 42,
    is_active: true,
    color: 'teal',
  },
]

const initialRouters: RouterItem[] = [
  { name: 'MikroTik routers', value: '3 / 3 online', status: 'good' },
  { name: 'Active access points', value: '18 online', status: 'good' },
  { name: 'Bandwidth usage', value: '68% capacity', status: 'warn' },
]

const initialRouterDevices: RouterDevice[] = [
  {
    id: 'rtr-1',
    name: 'MikroTik Core CCR2004',
    ip_address: '10.20.0.1',
    model: 'MikroTik CCR2004-16G-2S+',
    location: 'Main Server Rack (MDF)',
    status: 'good',
    clients_count: 146,
    traffic_down: '68.4 Mbps',
    traffic_up: '14.2 Mbps',
    cpu_load: 14,
    ram_load: 28,
    ping_ms: 1,
    uptime: '24d 18h',
  },
  {
    id: 'rtr-2',
    name: 'MikroTik AP Lobby & Cafe',
    ip_address: '10.20.0.34',
    model: 'MikroTik cAP ac (Dual-Band)',
    location: 'Ground Floor Lobby & Lounge',
    status: 'good',
    clients_count: 58,
    traffic_down: '24.5 Mbps',
    traffic_up: '6.8 Mbps',
    cpu_load: 28,
    ram_load: 45,
    ping_ms: 3,
    uptime: '18d 06h',
  },
  {
    id: 'rtr-3',
    name: 'MikroTik AP Poolside Deck',
    ip_address: '10.20.0.52',
    model: 'MikroTik wAP ac (Outdoor)',
    location: 'Poolside & Outdoor Pergola',
    status: 'good',
    clients_count: 34,
    traffic_down: '12.8 Mbps',
    traffic_up: '3.4 Mbps',
    cpu_load: 18,
    ram_load: 32,
    ping_ms: 4,
    uptime: '12d 04h',
  },
  {
    id: 'rtr-4',
    name: 'Ubiquiti UniFi AP 2nd Floor',
    ip_address: '10.20.0.78',
    model: 'Ubiquiti UniFi 6 Long-Range',
    location: '2nd Floor Conference Wing',
    status: 'warn',
    clients_count: 54,
    traffic_down: '31.2 Mbps',
    traffic_up: '5.1 Mbps',
    cpu_load: 64,
    ram_load: 68,
    ping_ms: 7,
    uptime: '9d 12h',
  },
]

const initialCustomers: CustomerRecord[] = [
  {
    id: 'cst-1',
    name: 'Maya Ochieng',
    phone: '+254 712 345 678',
    device: 'iPhone 14 Pro',
    plan: '24h Day Pass Unlimited',
    total_spent: 'KSh 3,250',
    data_usage: '18.4 GB',
    status: 'active',
    last_active: 'Just now (Lobby AP)',
    avatar_color: '#d36b4d',
  },
  {
    id: 'cst-2',
    name: 'Brian Kamau',
    phone: '+254 722 890 123',
    device: 'MacBook Air M2',
    plan: '7 Days Unlimited Flex',
    total_spent: 'KSh 8,400',
    data_usage: '64.2 GB',
    status: 'active',
    last_active: '5m ago (Poolside AP)',
    avatar_color: '#317d75',
  },
  {
    id: 'cst-3',
    name: 'Aisha Wanjiku',
    phone: '+254 733 456 789',
    device: 'Galaxy S24 Ultra',
    plan: '1 Hour Unlimited Rush',
    total_spent: 'KSh 1,450',
    data_usage: '8.2 GB',
    status: 'active',
    last_active: '12m ago (Cafe AP)',
    avatar_color: '#c58a32',
  },
  {
    id: 'cst-4',
    name: 'Peter Mwangi',
    phone: '+254 701 234 567',
    device: 'iPad Pro 11"',
    plan: '24h Day Pass Unlimited',
    total_spent: 'KSh 2,100',
    data_usage: '14.5 GB',
    status: 'idle',
    last_active: 'Yesterday, 18:20',
    avatar_color: '#4f779a',
  },
  {
    id: 'cst-5',
    name: 'Grace Njeri',
    phone: '+254 790 654 321',
    device: 'Dell XPS 15',
    plan: '7 Days Unlimited Flex',
    total_spent: 'KSh 6,000',
    data_usage: '48.9 GB',
    status: 'idle',
    last_active: 'Aug 25, 14:10',
    avatar_color: '#725796',
  },
  {
    id: 'cst-6',
    name: 'Samuel Kibet',
    phone: '+254 711 987 654',
    device: 'Google Pixel 8',
    plan: '5 GB data pass',
    total_spent: 'KSh 500',
    data_usage: '4.8 GB',
    status: 'blocked',
    last_active: 'Aug 24, 09:30',
    avatar_color: '#9e4732',
  },
]

function App() {
  const { theme, toggleTheme } = useTheme()
  const [operator, setOperator] = useState<{ email?: string } | null>({ email: 'operator@harborhouse.co.ke' })

  useEffect(() => {
    const client = supabase
    if (!client) return

    client.auth.getSession()
      .then(({ data }) => {
        if (data?.session?.user?.email) {
          setOperator({ email: data.session.user.email })
        }
      })
      .catch(() => {})

    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        setOperator({ email: session.user.email })
      }
    })

    return () => listener?.subscription?.unsubscribe()
  }, [])

  return (
    <OperatorDashboard
      operatorEmail={operator?.email}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  )
}

function OperatorDashboard({
  operatorEmail,
  theme,
  onToggleTheme,
}: {
  operatorEmail?: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}) {
  const [activeNav, setActiveNav] = useState('Overview')
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [transactionsList, setTransactionsList] = useState<Transaction[]>(initialTransactions)
  const [packages, setPackages] = useState<HotspotPackage[]>(initialPackagesList)
  const [routersList, setRoutersList] = useState<RouterItem[]>(initialRouters)
  const [routerDevices, setRouterDevices] = useState<RouterDevice[]>(initialRouterDevices)
  const [customersList, setCustomersList] = useState<CustomerRecord[]>(initialCustomers)
  const [voucherCountTotal, setVoucherCountTotal] = useState(12)
  const [showVoucher, setShowVoucher] = useState(false)
  const [showDbSettings, setShowDbSettings] = useState(false)
  const [showAddRouter, setShowAddRouter] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showAddPackage, setShowAddPackage] = useState(false)
  const [voucherPackage, setVoucherPackage] = useState('24h Day Pass Unlimited')
  const [voucherCount, setVoucherCount] = useState(10)
  const [notice, setNotice] = useState('')
  const [dbConnected, setDbConnected] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // New Router Form State
  const [newRouterName, setNewRouterName] = useState('')
  const [newRouterIp, setNewRouterIp] = useState('')
  const [newRouterModel, setNewRouterModel] = useState('MikroTik cAP ac')
  const [newRouterLocation, setNewRouterLocation] = useState('')

  // New Customer Form State
  const [newCustName, setNewCustName] = useState('')
  const [newCustPhone, setNewCustPhone] = useState('')
  const [newCustDevice, setNewCustDevice] = useState('')
  const [newCustPlan, setNewCustPlan] = useState('24h Day Pass Unlimited')

  // New Package Form State
  const [newPkgName, setNewPkgName] = useState('')
  const [newPkgCategory, setNewPkgCategory] = useState<'hourly' | 'daily' | 'weekly' | 'monthly' | 'multi-device'>('daily')
  const [newPkgPrice, setNewPkgPrice] = useState('350')
  const [newPkgDuration, setNewPkgDuration] = useState('24 Hours')
  const [newPkgDataLimit, setNewPkgDataLimit] = useState('Unlimited')
  const [newPkgSpeed, setNewPkgSpeed] = useState('20 Mbps')
  const [newPkgDevices, setNewPkgDevices] = useState('1')
  const [newPkgColor, setNewPkgColor] = useState('orange')

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
  const [customKeyInput, setCustomKeyInput] = useState(supabaseAnonKey)

  const handleThemeToggle = () => {
    onToggleTheme()
    setNotice(theme === 'light' ? 'Switched to Dark mode' : 'Switched to Light mode')
    window.setTimeout(() => setNotice(''), 2600)
  }

  const applyPackagePreset = (
    name: string,
    cat: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'multi-device',
    price: string,
    duration: string,
    quota: string,
    speed: string,
    devices: string,
    color: string
  ) => {
    setNewPkgName(name)
    setNewPkgCategory(cat)
    setNewPkgPrice(price)
    setNewPkgDuration(duration)
    setNewPkgDataLimit(quota)
    setNewPkgSpeed(speed)
    setNewPkgDevices(devices)
    setNewPkgColor(color)
  }

  const loadAllDatabaseData = async () => {
    const client = supabase
    if (!client) {
      setDbConnected(false)
      return
    }
    setSyncing(true)

    try {
      // 1. Load Sessions
      const { data: sessionsData, error: sessionsError } = await client
        .from('hotspot_sessions')
        .select('id, customer_name, device, location, plan, usage, progress, color')
        .is('disconnected_at', null)
        .order('connected_at', { ascending: false })

      if (!sessionsError && sessionsData && sessionsData.length > 0) {
        setSessions(sessionsData.map((session) => ({
          id: session.id,
          name: session.customer_name,
          device: session.device,
          location: session.location,
          plan: session.plan,
          usage: session.usage,
          progress: session.progress,
          color: session.color,
        })))
        setDbConnected(true)
      }

      // 2. Load Customers
      const { data: custData, error: custError } = await client
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (!custError && custData && custData.length > 0) {
        setCustomersList(custData.map((c: any) => ({
          id: c.id,
          name: c.name,
          phone: c.phone || '+254 700 000 000',
          device: c.device || 'Mobile Device',
          plan: '24h Day Pass Unlimited',
          total_spent: `KSh ${(c.total_spent || 0).toLocaleString()}`,
          data_usage: '12.4 GB',
          status: 'active',
          last_active: 'Recently connected',
          avatar_color: '#317d75',
        })))
      }

      // 3. Load Packages
      const { data: pkgData, error: pkgError } = await client
        .from('packages')
        .select('*')
        .order('sales_count', { ascending: false })

      if (!pkgError && pkgData && pkgData.length > 0) {
        setPackages((prev) => {
          const mapped: HotspotPackage[] = pkgData.map((p: any) => {
            const existing = prev.find((e) => e.name === p.name)
            return {
              id: p.id,
              name: p.name,
              category: (p.duration?.toLowerCase().includes('hour') ? 'hourly' : p.duration?.toLowerCase().includes('day') ? 'daily' : p.duration?.toLowerCase().includes('week') ? 'weekly' : p.duration?.toLowerCase().includes('month') ? 'monthly' : 'daily') as any,
              price: Number(p.price_amount) || 250,
              duration_display: p.duration || '24 Hours',
              data_limit: p.data_limit || 'Unlimited',
              speed_limit: p.speed_limit || '20 Mbps',
              device_limit: p.device_limit || (p.name.includes('Device') ? 2 : 1),
              sales_count: p.sales_count || 0,
              is_active: p.is_active ?? true,
              color: p.color || 'orange',
            }
          })
          return mapped.length > 0 ? mapped : prev
        })
      }

      // 4. Load Transactions
      const { data: trxData, error: trxEerror } = await client
        .from('transactions')
        .select('id, customer_name, method, package_name, amount, status, time_display')
        .order('created_at', { ascending: false })
        .limit(10)

      if (!trxEerror && trxData && trxData.length > 0) {
        setTransactionsList(trxData.map((trx) => ({
          id: trx.id,
          customer: trx.customer_name,
          method: trx.method,
          package: trx.package_name,
          amount: trx.amount,
          status: trx.status,
          time: trx.time_display,
        })))
      }

      // 5. Load Vouchers count
      const { count: vCount } = await client
        .from('vouchers')
        .select('*', { count: 'exact', head: true })
        .is('redeemed_at', null)

      if (vCount !== null && vCount !== undefined) {
        setVoucherCountTotal(vCount)
      }

      // 6. Load Routers
      const { data: routerData, error: routerError } = await client
        .from('routers')
        .select('id, name, ip_address, model, location, status')

      if (!routerError && routerData && routerData.length > 0) {
        const total = routerData.length
        const online = routerData.filter((r) => r.status === 'good').length
        setRoutersList([
          { name: 'MikroTik routers', value: `${online} / ${total} online`, status: online === total ? 'good' : 'warn' },
          { name: 'Active access points', value: `${total * 6} online`, status: 'good' },
          { name: 'Bandwidth usage', value: '68% capacity', status: 'warn' },
        ])
      }
    } catch (err: any) {
      console.warn('Database note:', err)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    void loadAllDatabaseData()

    const client = supabase
    if (!client) return

    try {
      const channel = client
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'hotspot_sessions' }, () => {
          void loadAllDatabaseData()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, () => {
          void loadAllDatabaseData()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
          void loadAllDatabaseData()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vouchers' }, () => {
          void loadAllDatabaseData()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
          void loadAllDatabaseData()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'routers' }, () => {
          void loadAllDatabaseData()
        })
        .subscribe()

      return () => {
        void client.removeChannel(channel)
      }
    } catch (e) {}
  }, [])

  const disconnect = async (session: Session) => {
    const client = supabase
    if (client && session.id) {
      try {
        await client
          .from('hotspot_sessions')
          .update({ disconnected_at: new Date().toISOString() })
          .eq('id', session.id)
      } catch (e) {}
    }

    setSessions((current) => current.filter((item) => item.id ? item.id !== session.id : item.name !== session.name))
    setNotice(`${session.name} disconnected`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  const generateVouchers = async () => {
    const count = Math.max(1, Math.floor(voucherCount))
    const client = supabase
    if (client) {
      try {
        const vouchers = Array.from({ length: count }, () => ({
          code: crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase(),
          package_name: voucherPackage,
        }))
        await client.from('vouchers').insert(vouchers)
      } catch (e) {}
    }

    setVoucherCountTotal((prev) => prev + count)
    setShowVoucher(false)
    setNotice(`${count} vouchers generated successfully`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  // Router Handlers
  const handlePingRouter = (router: RouterDevice) => {
    const newPing = Math.floor(Math.random() * 4) + 1
    setRouterDevices((prev) =>
      prev.map((r) => (r.id === router.id ? { ...r, ping_ms: newPing } : r))
    )
    setNotice(`Ping to ${router.name} (${router.ip_address}): ${newPing}ms (Normal)`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const handleRebootRouter = (router: RouterDevice) => {
    setNotice(`Rebooting ${router.name}... RouterOS restarting`)
    setRouterDevices((prev) =>
      prev.map((r) => (r.id === router.id ? { ...r, status: 'warn', uptime: '0m' } : r))
    )

    window.setTimeout(() => {
      setRouterDevices((prev) =>
        prev.map((r) => (r.id === router.id ? { ...r, status: 'good', uptime: '1m', ping_ms: 2 } : r))
      )
      setNotice(`✅ ${router.name} rebooted and back online!`)
      window.setTimeout(() => setNotice(''), 3500)
    }, 2200)
  }

  const handleDeleteRouter = async (routerId: string, routerName: string) => {
    const client = supabase
    if (client) {
      try {
        await client.from('routers').delete().eq('id', routerId)
      } catch (e) {}
    }
    setRouterDevices((prev) => prev.filter((r) => r.id !== routerId))
    setNotice(`${routerName} removed from workspace`)
    window.setTimeout(() => setNotice(''), 2500)
  }

  const handleAddRouterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRouterName.trim() || !newRouterIp.trim()) return

    const newDevice: RouterDevice = {
      id: crypto.randomUUID(),
      name: newRouterName.trim(),
      ip_address: newRouterIp.trim(),
      model: newRouterModel,
      location: newRouterLocation.trim() || 'Harbor House AP',
      status: 'good',
      clients_count: 0,
      traffic_down: '0.0 Mbps',
      traffic_up: '0.0 Mbps',
      cpu_load: 8,
      ram_load: 22,
      ping_ms: 2,
      uptime: '1m',
    }

    const client = supabase
    if (client) {
      try {
        await client.from('routers').insert({
          name: newDevice.name,
          ip_address: newDevice.ip_address,
          model: newDevice.model,
          location: newDevice.location,
          status: 'good',
        })
      } catch (e) {}
    }

    setRouterDevices((prev) => [newDevice, ...prev])
    setShowAddRouter(false)
    setNewRouterName('')
    setNewRouterIp('')
    setNewRouterLocation('')
    setNotice(`Router ${newDevice.name} registered and online!`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  // Customer Handlers
  const handleToggleBlockCustomer = (customer: CustomerRecord) => {
    const nextStatus = customer.status === 'blocked' ? 'active' : 'blocked'
    setCustomersList((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, status: nextStatus } : c))
    )
    setNotice(
      nextStatus === 'blocked'
        ? `🚫 ${customer.name} blocked from Wi-Fi access`
        : `✅ ${customer.name} unblocked successfully`
    )
    window.setTimeout(() => setNotice(''), 3000)
  }

  const handleDeleteCustomer = async (customerId: string, customerName: string) => {
    const client = supabase
    if (client) {
      try {
        await client.from('customers').delete().eq('id', customerId)
      } catch (e) {}
    }
    setCustomersList((prev) => prev.filter((c) => c.id !== customerId))
    setNotice(`Customer ${customerName} removed`)
    window.setTimeout(() => setNotice(''), 2500)
  }

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustName.trim()) return

    const palette = ['#d36b4d', '#317d75', '#c58a32', '#4f779a', '#725796']
    const randomColor = palette[Math.floor(Math.random() * palette.length)]

    const newCust: CustomerRecord = {
      id: crypto.randomUUID(),
      name: newCustName.trim(),
      phone: newCustPhone.trim() || '+254 700 000 000',
      device: newCustDevice.trim() || 'Smart Device',
      plan: newCustPlan,
      total_spent: 'KSh 0',
      data_usage: '0 MB',
      status: 'active',
      last_active: 'Just registered',
      avatar_color: randomColor,
    }

    const client = supabase
    if (client) {
      try {
        await client.from('customers').insert({
          name: newCust.name,
          phone: newCust.phone,
          device: newCust.device,
          total_spent: 0,
        })
      } catch (e) {}
    }

    setCustomersList((prev) => [newCust, ...prev])
    setShowAddCustomer(false)
    setNewCustName('')
    setNewCustPhone('')
    setNewCustDevice('')
    setNotice(`Customer ${newCust.name} added successfully!`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const handleExportCustomersCSV = () => {
    const headers = 'ID,Name,Phone,Device,Plan,Total Spent,Data Usage,Status,Last Active\n'
    const rows = customersList
      .map((c) => `"${c.id}","${c.name}","${c.phone}","${c.device}","${c.plan}","${c.total_spent}","${c.data_usage}","${c.status}","${c.last_active}"`)
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `orion_customers_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setNotice('Customer directory exported to CSV')
    window.setTimeout(() => setNotice(''), 2500)
  }

  // Package Handlers
  const handleTogglePackageActive = (pkgId: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkgId ? { ...p, is_active: !p.is_active } : p))
    )
    setNotice('Package availability status updated')
    window.setTimeout(() => setNotice(''), 2000)
  }

  const handleDeletePackage = async (pkgId: string, pkgName: string) => {
    const client = supabase
    if (client) {
      try {
        await client.from('packages').delete().eq('id', pkgId)
      } catch (e) {}
    }
    setPackages((prev) => prev.filter((p) => p.id !== pkgId))
    setNotice(`Package "${pkgName}" deleted`)
    window.setTimeout(() => setNotice(''), 2500)
  }

  const handleAddPackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPkgName.trim()) return

    const priceNum = Number(newPkgPrice) || 100
    const devLimit = Math.max(1, Number(newPkgDevices) || 1)

    const newPackage: HotspotPackage = {
      id: crypto.randomUUID(),
      name: newPkgName.trim(),
      category: newPkgCategory,
      price: priceNum,
      duration_display: newPkgDuration.trim() || '24 Hours',
      data_limit: newPkgDataLimit.trim() || 'Unlimited',
      speed_limit: newPkgSpeed.trim() || '20 Mbps',
      device_limit: devLimit,
      sales_count: 0,
      is_active: true,
      color: newPkgColor,
    }

    const client = supabase
    if (client) {
      try {
        await client.from('packages').insert({
          name: newPackage.name,
          price_amount: newPackage.price,
          duration: newPackage.duration_display,
          data_limit: newPackage.data_limit,
          sales_count: 0,
          color: newPackage.color,
          is_active: true,
        })
      } catch (e) {}
    }

    setPackages((prev) => [newPackage, ...prev])
    setShowAddPackage(false)
    setNewPkgName('')
    setNewPkgPrice('350')
    setNewPkgDuration('24 Hours')
    setNotice(`Package "${newPackage.name}" created and ready for sale!`)
    window.setTimeout(() => setNotice(''), 3000)
  }

  const handleSaveCustomKey = (e: React.FormEvent) => {
    e.preventDefault()
    setSupabaseConfig(supabaseUrl, customKeyInput.trim())
    setShowDbSettings(false)
    setNotice('Supabase configuration updated!')
    window.setTimeout(() => {
      window.location.reload()
    }, 600)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Signal size={20} /></div>
          <span>orion<span className="brand-dot">.</span></span>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-avatar">H</div>
          <div>
            <strong>Harbor House</strong>
            <span>Westlands, Nairobi</span>
          </div>
          <ChevronDown size={15} />
        </div>
        <nav>
          <p className="nav-label">Workspace</p>
          {[
            ['Overview', LayoutDashboard], ['Customers', Users], ['Packages', Ticket], ['Vouchers', ReceiptText],
            ['Transactions', CreditCard], ['Routers', Router],
          ].map(([label, Icon]) => (
            <button
              key={label as string}
              className={`nav-item ${activeNav === label ? 'active' : ''}`}
              onClick={() => setActiveNav(label as string)}
            >
              <Icon size={18} />
              <span>{label as string}</span>
              {label === 'Packages' && <b className="nav-count" style={{ background: '#fdf1e7', color: 'var(--coral)' }}>{packages.length}</b>}
              {label === 'Customers' && <b className="nav-count" style={{ background: '#eaf3eb', color: '#34786d' }}>{customersList.length}</b>}
              {label === 'Vouchers' && <b className="nav-count">{voucherCountTotal}</b>}
              {label === 'Routers' && <b className="nav-count" style={{ background: 'var(--metric-icon-teal-bg)', color: 'var(--metric-icon-teal-color)' }}>{routerDevices.length}</b>}
            </button>
          ))}
          <p className="nav-label support-label">Manage</p>
          {[["Reports", Activity], ["Settings", Settings2]].map(([label, Icon]) => (
            <button
              key={label as string}
              className={`nav-item ${activeNav === label ? 'active' : ''}`}
              onClick={() => setActiveNav(label as string)}
            >
              <Icon size={18} />
              <span>{label as string}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-box">
            <div className="help-icon"><LifeBuoy size={17} /></div>
            <strong>Need a hand?</strong>
            <span>Visit the help center</span>
          </div>

          <button
            className="sidebar-theme-toggle"
            onClick={handleThemeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span>Appearance</span>
            <div className="theme-pill">
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </div>
          </button>

          <div className="profile">
            <div className="profile-avatar">JM</div>
            <div>
              <strong>{operatorEmail ?? 'Janet Muthoni'}</strong>
              <span>Owner</span>
            </div>
            <button
              className="icon-button"
              title="Database Settings"
              onClick={() => setShowDbSettings(true)}
              aria-label="Database Settings"
            >
              <Database size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Harbor House</span>
            <span>/</span>
            <strong>{activeNav}</strong>
          </div>
          <div className="top-actions">
            <div
              className="live-pill"
              style={{ padding: '6px 10px', cursor: 'pointer' }}
              title="Supabase Database Status"
              onClick={() => setShowDbSettings(true)}
            >
              <Database size={13} />
              <span>{syncing ? 'Syncing...' : dbConnected ? 'Live DB' : 'Workspace Ready'}</span>
            </div>

            <button
              className="icon-button"
              aria-label="Refresh Data"
              title="Sync data"
              onClick={() => {
                void loadAllDatabaseData()
                setNotice('Workspace synchronized')
                window.setTimeout(() => setNotice(''), 2000)
              }}
            >
              <RefreshCw size={17} className={syncing ? 'spinning' : ''} />
            </button>

            <button className="icon-button" aria-label="Search" onClick={() => setNotice('Search is ready for your workspace')}><Search size={19} /></button>
            <button className="icon-button notification" aria-label="Notifications" onClick={() => setNotice('You are all caught up')}><Bell size={19} /><i /></button>

            <button
              className="theme-toggle-btn"
              onClick={handleThemeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </button>

            <div className="date-control"><Clock3 size={16} /> Aug 01 – Aug 31 <ChevronDown size={14} /></div>
          </div>
        </header>

        <div className="page-wrap">
          {activeNav === 'Overview' && (
            <>
              <section className="page-heading">
                <div>
                  <p className="eyebrow">Wednesday, August 26, 2026</p>
                  <h1>Good morning, Janet <span>✦</span></h1>
                  <p className="heading-sub">Here is what is happening across your hotspot today.</p>
                </div>
                <div className="heading-actions">
                  <button className="button secondary" onClick={() => setNotice('Report export prepared')}>
                    <ArrowDownRight size={16} /> Export report
                  </button>
                  <button className="button primary" onClick={() => setShowVoucher(true)}>
                    <Plus size={17} /> Create voucher
                  </button>
                </div>
              </section>

              <section className="metrics-grid">
                <Metric label="Total revenue" value="KSh 284,650" change="18.4%" trend="up" icon={CircleDollarSign} accent="green" />
                <Metric label="Active customers" value={String(customersList.length + 1278)} change="12.6%" trend="up" icon={Users} accent="orange" />
                <Metric label="Live sessions" value={String(sessions.length + 146)} change="4.2%" trend="up" icon={Wifi} accent="teal" />
                <Metric label="Avg. session time" value="3h 42m" change="8.1%" trend="down" icon={Gauge} accent="blue" />
              </section>

              <div className="content-grid">
                <section className="panel revenue-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Revenue overview</h2>
                      <p>Monthly income from all access packages</p>
                    </div>
                    <button className="select-button">Last 30 days <ChevronDown size={14} /></button>
                  </div>
                  <div className="revenue-total">
                    <strong>KSh 284,650</strong>
                    <span className="positive"><ArrowUpRight size={14} /> 18.4%</span>
                  </div>
                  <RevenueChart />
                </section>

                <section className="panel network-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Network health</h2>
                      <p>All systems are operational</p>
                    </div>
                    <span className="live-pill"><i /> Live</span>
                  </div>
                  <div className="network-score">
                    <div className="score-ring">
                      <strong>98</strong>
                      <span>/100</span>
                    </div>
                    <div>
                      <strong>Excellent</strong>
                      <p>Uptime this month</p>
                    </div>
                  </div>
                  <div className="health-list">
                    {routersList.map((r, i) => (
                      <HealthRow key={i} label={r.name} value={r.value} status={r.status} />
                    ))}
                  </div>
                  <button className="text-button" onClick={() => setActiveNav('Routers')}>
                    View network details <ArrowUpRight size={15} />
                  </button>
                </section>
              </div>

              <div className="content-grid lower-grid">
                <section className="panel sessions-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Live sessions <span className="heading-badge">{sessions.length + 146}</span></h2>
                      <p>Customers currently connected</p>
                    </div>
                    <button className="text-button" onClick={() => setActiveNav('Customers')}>
                      View all <ArrowUpRight size={15} />
                    </button>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Package</th>
                          <th>Usage</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((session) => (
                          <tr key={session.id ?? session.name}>
                            <td>
                              <div className="customer-cell">
                                <div className="customer-avatar" style={{ background: session.color }}>
                                  {session.name.split(' ').map((word) => word[0]).join('')}
                                </div>
                                <div>
                                  <strong>{session.name}</strong>
                                  <span>{session.device} · {session.location}</span>
                                </div>
                              </div>
                            </td>
                            <td><span className="package-name">{session.plan}</span></td>
                            <td>
                              <div className="usage-cell">
                                <div className="usage-bar"><i style={{ width: `${session.progress}%` }} /></div>
                                <span>{session.usage}</span>
                              </div>
                            </td>
                            <td>
                              <button
                                className="row-action"
                                aria-label={`Disconnect ${session.name}`}
                                title="Disconnect session"
                                onClick={() => void disconnect(session)}
                              >
                                <X size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="panel package-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Popular packages</h2>
                      <p>Sales by access plan</p>
                    </div>
                    <button className="more-button" aria-label="More package options"><MoreHorizontal size={18} /></button>
                  </div>
                  <div className="package-list">
                    {packages.slice(0, 3).map((pkg) => (
                      <PackageRow
                        key={pkg.id}
                        name={pkg.name}
                        sales={`${pkg.sales_count} sold`}
                        amount={`KSh ${(pkg.price * (pkg.sales_count || 1)).toLocaleString()}`}
                        width={`${Math.min(100, Math.round((pkg.sales_count / 500) * 100))}%`}
                        color={pkg.color}
                      />
                    ))}
                  </div>
                  <button className="outline-button" onClick={() => setActiveNav('Packages')}>
                    Manage packages <ArrowUpRight size={15} />
                  </button>
                </section>
              </div>

              <section className="panel transactions-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent transactions</h2>
                    <p>Latest payments and voucher redemptions</p>
                  </div>
                  <button className="text-button" onClick={() => setActiveNav('Transactions')}>
                    View all transactions <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Transaction</th>
                        <th>Customer</th>
                        <th>Method</th>
                        <th>Package</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsList.map((transaction) => (
                        <tr key={transaction.id}>
                          <td><strong className="transaction-id">{transaction.id}</strong></td>
                          <td>{transaction.customer}</td>
                          <td>
                            <span className="method">
                              <span className={`method-dot ${transaction.method === 'M-Pesa' ? 'mpesa' : transaction.method === 'Voucher' ? 'voucher' : 'airtel'}`} />
                              {transaction.method}
                            </span>
                          </td>
                          <td>{transaction.package}</td>
                          <td><strong>{transaction.amount}</strong></td>
                          <td><span className={`status ${transaction.status.toLowerCase()}`}>{transaction.status}</span></td>
                          <td className="muted">{transaction.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {activeNav === 'Packages' && (
            <PackagesManagementView
              packages={packages}
              onToggleActive={handleTogglePackageActive}
              onDelete={handleDeletePackage}
              onAddNewClick={() => setShowAddPackage(true)}
              onGenerateVouchersForPackage={(pkgName) => {
                setVoucherPackage(pkgName)
                setShowVoucher(true)
              }}
            />
          )}

          {activeNav === 'Customers' && (
            <CustomersManagementView
              customers={customersList}
              onToggleBlock={handleToggleBlockCustomer}
              onDelete={handleDeleteCustomer}
              onExportCSV={handleExportCustomersCSV}
              onAddNewClick={() => setShowAddCustomer(true)}
            />
          )}

          {activeNav === 'Routers' && (
            <RoutersManagementView
              routers={routerDevices}
              onPing={handlePingRouter}
              onReboot={handleRebootRouter}
              onDelete={handleDeleteRouter}
              onAddNewClick={() => setShowAddRouter(true)}
            />
          )}

          {activeNav !== 'Overview' && activeNav !== 'Routers' && activeNav !== 'Customers' && activeNav !== 'Packages' && (
            <SectionPlaceholder section={activeNav} />
          )}
        </div>
      </main>

      {/* Add Custom Package Modal */}
      {showAddPackage && (
        <div className="modal-backdrop" onClick={() => setShowAddPackage(false)}>
          <div className="modal" style={{ width: 'min(100%, 480px)' }} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddPackage(false)}><X size={18} /></button>
            <div className="modal-icon"><Ticket size={22} /></div>
            <p className="eyebrow">Pricing & Quotas</p>
            <h2>Create Access Package</h2>
            <p className="modal-copy">Create custom unlimited or quota-capped hourly, daily, weekly, and monthly plans.</p>

            <div style={{ margin: '8px 0 4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>Quick Unlimited Presets:</span>
              <div className="preset-pills-wrap">
                <button
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => applyPackagePreset('1 Hour Unlimited Rush', 'hourly', '70', '1 Hour', 'Unlimited', '10 Mbps', '1', 'yellow')}
                >
                  ⚡ 1h Unlimited (KSh 70)
                </button>
                <button
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => applyPackagePreset('24h Day Pass Unlimited', 'daily', '350', '24 Hours', 'Unlimited', '20 Mbps', '1', 'orange')}
                >
                  ⚡ 24h Unlimited (KSh 350)
                </button>
                <button
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => applyPackagePreset('7 Days Unlimited Flex', 'weekly', '1500', '7 Days', 'Unlimited', '25 Mbps', '1', 'teal')}
                >
                  ⚡ 7d Unlimited (KSh 1.5k)
                </button>
                <button
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => applyPackagePreset('30 Days Monthly Unlimited', 'monthly', '3500', '30 Days', 'Unlimited', '30 Mbps', '1', 'green')}
                >
                  ⚡ 30d Unlimited (KSh 3.5k)
                </button>
                <button
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => applyPackagePreset('Family 3-Devices 30d Unlimited', 'multi-device', '5500', '30 Days', 'Unlimited Shared', '40 Mbps Turbo', '3', 'teal')}
                >
                  👨‍👩‍👧 Family 3-Dev Unlimited
                </button>
              </div>
            </div>

            <form onSubmit={handleAddPackageSubmit}>
              <label>
                Package Plan Name
                <input
                  type="text"
                  required
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  placeholder="e.g. Student Weekend Pass, Family 3-Devices"
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label>
                  Duration Category
                  <select
                    value={newPkgCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any
                      setNewPkgCategory(cat)
                      if (cat === 'hourly') setNewPkgDuration('1 Hour')
                      else if (cat === 'daily') setNewPkgDuration('24 Hours')
                      else if (cat === 'weekly') setNewPkgDuration('7 Days')
                      else if (cat === 'monthly') setNewPkgDuration('30 Days')
                      else if (cat === 'multi-device') setNewPkgDevices('3')
                    }}
                  >
                    <option value="hourly">Hourly (Quick Pass)</option>
                    <option value="daily">Daily (24h / Multi-day)</option>
                    <option value="weekly">Weekly (7 Days / 14 Days)</option>
                    <option value="monthly">Monthly (30 Days)</option>
                    <option value="multi-device">Multi-Device / Family</option>
                  </select>
                </label>

                <label>
                  Price (KSh)
                  <input
                    type="number"
                    required
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    min="10"
                    placeholder="350"
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label>
                  Duration Label
                  <input
                    type="text"
                    required
                    value={newPkgDuration}
                    onChange={(e) => setNewPkgDuration(e.target.value)}
                    placeholder="e.g. 3 Hours, 24 Hours, 30 Days"
                  />
                </label>

                <label>
                  Max Concurrent Devices
                  <select value={newPkgDevices} onChange={(e) => setNewPkgDevices(e.target.value)}>
                    <option value="1">1 Device (Individual)</option>
                    <option value="2">2 Devices (Duo)</option>
                    <option value="3">3 Devices (Family 3x)</option>
                    <option value="4">4 Devices (Family 4x)</option>
                    <option value="5">5 Devices (Team / Office)</option>
                    <option value="10">10 Devices (Group / Event)</option>
                  </select>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label>
                  Data Quota
                  <select value={newPkgDataLimit} onChange={(e) => setNewPkgDataLimit(e.target.value)}>
                    <option value="Unlimited">♾️ Unlimited Data</option>
                    <option value="Unlimited Shared">♾️ Unlimited Shared (Multi-Device)</option>
                    <option value="1 GB">1 GB</option>
                    <option value="3 GB">3 GB</option>
                    <option value="5 GB">5 GB</option>
                    <option value="10 GB">10 GB</option>
                    <option value="20 GB">20 GB</option>
                    <option value="50 GB">50 GB</option>
                    <option value="100 GB">100 GB</option>
                  </select>
                </label>

                <label>
                  Speed Cap
                  <select value={newPkgSpeed} onChange={(e) => setNewPkgSpeed(e.target.value)}>
                    <option value="5 Mbps">5 Mbps (Standard)</option>
                    <option value="10 Mbps">10 Mbps (Fast)</option>
                    <option value="20 Mbps">20 Mbps (High Speed)</option>
                    <option value="30 Mbps">30 Mbps (Ultra Fast)</option>
                    <option value="40 Mbps Turbo">40 Mbps (Turbo)</option>
                    <option value="50 Mbps Turbo">50 Mbps (Gigabit Turbo)</option>
                  </select>
                </label>
              </div>

              <label>
                Theme Color Accent
                <select value={newPkgColor} onChange={(e) => setNewPkgColor(e.target.value)}>
                  <option value="orange">Coral Orange (Popular)</option>
                  <option value="teal">Emerald Teal</option>
                  <option value="yellow">Amber Yellow</option>
                  <option value="green">Forest Green</option>
                </select>
              </label>

              <button className="button primary full" type="submit" style={{ marginTop: '14px' }}>
                <Plus size={16} /> Save & Publish Package
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="modal-backdrop" onClick={() => setShowAddCustomer(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddCustomer(false)}><X size={18} /></button>
            <div className="modal-icon"><UserPlus size={22} /></div>
            <p className="eyebrow">Customer Directory</p>
            <h2>Add New Customer</h2>
            <p className="modal-copy">Register a new subscriber or walk-in customer into your billing system.</p>
            <form onSubmit={handleAddCustomerSubmit}>
              <label>
                Full Name
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. David Mwangi"
                />
              </label>
              <label>
                Phone Number (M-Pesa)
                <input
                  type="tel"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="e.g. +254 712 345 678"
                />
              </label>
              <label>
                Primary Device
                <input
                  type="text"
                  value={newCustDevice}
                  onChange={(e) => setNewCustDevice(e.target.value)}
                  placeholder="e.g. iPhone 15 / MacBook"
                />
              </label>
              <label>
                Initial Access Plan
                <select value={newCustPlan} onChange={(e) => setNewCustPlan(e.target.value)}>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.name}>
                      {pkg.name} (KSh {pkg.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </label>
              <button className="button primary full" type="submit">
                <Plus size={16} /> Register Customer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Router Modal */}
      {showAddRouter && (
        <div className="modal-backdrop" onClick={() => setShowAddRouter(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddRouter(false)}><X size={18} /></button>
            <div className="modal-icon"><Router size={22} /></div>
            <p className="eyebrow">Hardware Configuration</p>
            <h2>Add Router / Access Point</h2>
            <p className="modal-copy">Connect a MikroTik RouterOS or Ubiquiti UniFi AP to this hotspot workspace.</p>
            <form onSubmit={handleAddRouterSubmit}>
              <label>
                Router / AP Name
                <input
                  type="text"
                  required
                  value={newRouterName}
                  onChange={(e) => setNewRouterName(e.target.value)}
                  placeholder="e.g. MikroTik AP Rooftop Deck"
                />
              </label>
              <label>
                IP Address
                <input
                  type="text"
                  required
                  value={newRouterIp}
                  onChange={(e) => setNewRouterIp(e.target.value)}
                  placeholder="e.g. 10.20.0.60"
                />
              </label>
              <label>
                Hardware Model
                <select value={newRouterModel} onChange={(e) => setNewRouterModel(e.target.value)}>
                  <option value="MikroTik CCR2004">MikroTik CCR2004 (Core Gateway)</option>
                  <option value="MikroTik cAP ac">MikroTik cAP ac (Indoor AP)</option>
                  <option value="MikroTik wAP ac">MikroTik wAP ac (Outdoor AP)</option>
                  <option value="MikroTik hEX S">MikroTik hEX S (Branch Router)</option>
                  <option value="Ubiquiti UniFi 6 LR">Ubiquiti UniFi 6 LR (Long-Range AP)</option>
                  <option value="Generic RouterOS">Generic RouterOS Gateway</option>
                </select>
              </label>
              <label>
                Location in Premises
                <input
                  type="text"
                  value={newRouterLocation}
                  onChange={(e) => setNewRouterLocation(e.target.value)}
                  placeholder="e.g. Rooftop Dining Area"
                />
              </label>
              <button className="button primary full" type="submit">
                <Plus size={16} /> Save & Register Device
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Voucher Generation Modal */}
      {showVoucher && (
        <div className="modal-backdrop" onClick={() => setShowVoucher(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowVoucher(false)}><X size={18} /></button>
            <div className="modal-icon"><Ticket size={22} /></div>
            <p className="eyebrow">Quick action</p>
            <h2>Create vouchers</h2>
            <p className="modal-copy">Generate a batch of access codes for your walk-in customers.</p>
            <label>
              Package
              <select value={voucherPackage} onChange={(event) => setVoucherPackage(event.target.value)}>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.name}>
                    {pkg.name} ({pkg.duration_display} - KSh {pkg.price})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Number of vouchers
              <input
                type="number"
                value={voucherCount}
                onChange={(event) => setVoucherCount(Number(event.target.value))}
                min="1"
              />
            </label>
            <button className="button primary full" onClick={() => void generateVouchers()}>
              <Zap size={16} /> Generate vouchers
            </button>
          </div>
        </div>
      )}

      {/* Supabase Database Settings Modal */}
      {showDbSettings && (
        <div className="modal-backdrop" onClick={() => setShowDbSettings(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDbSettings(false)}><X size={18} /></button>
            <div className="modal-icon"><Database size={22} /></div>
            <p className="eyebrow">Integration</p>
            <h2>Supabase Database</h2>
            <p className="modal-copy">Project Reference: <code>ezcwgyhwotomranbyuyh</code></p>
            <form onSubmit={handleSaveCustomKey}>
              <label>
                Anon Public Key (JWT starting with <code>eyJ...</code>)
                <input
                  type="text"
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  style={{ fontFamily: 'monospace', fontSize: '11px' }}
                />
              </label>
              <div style={{ margin: '10px 0 16px' }}>
                <a
                  href="https://supabase.com/dashboard/project/ezcwgyhwotomranbyuyh/settings/api"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--coral)', fontSize: '12px', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Open Supabase API Settings <ExternalLink size={13} />
                </a>
              </div>
              <button className="button primary full" type="submit">
                Save & Reconnect
              </button>
            </form>
          </div>
        </div>
      )}

      {notice && <div className="toast"><ShieldCheck size={18} /> {notice}</div>}
    </div>
  )
}

function PackagesManagementView({
  packages,
  onToggleActive,
  onDelete,
  onAddNewClick,
  onGenerateVouchersForPackage,
}: {
  packages: HotspotPackage[]
  onToggleActive: (id: string) => void
  onDelete: (id: string, name: string) => void
  onAddNewClick: () => void
  onGenerateVouchersForPackage: (name: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | 'unlimited' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'multi-device'>('all')

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.duration_display.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.data_limit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(pkg.price).includes(searchQuery)

    const isUnlimited = pkg.data_limit.toLowerCase().includes('unlimited')
    const matchesCategory =
      filterCategory === 'all'
        ? true
        : filterCategory === 'unlimited'
        ? isUnlimited
        : pkg.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const totalRevenue = packages.reduce((acc, p) => acc + p.price * p.sales_count, 0)
  const totalSales = packages.reduce((acc, p) => acc + p.sales_count, 0)
  const unlimitedCount = packages.filter((p) => p.data_limit.toLowerCase().includes('unlimited')).length

  return (
    <div className="packages-view">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Access Tiers & Plans</p>
          <h1>Package Management</h1>
          <p className="heading-sub">
            Design and sell customized internet packages (unlimited hourly, daily, weekly, monthly, and multi-device plans).
          </p>
        </div>
        <div className="heading-actions">
          <button className="button primary" onClick={onAddNewClick}>
            <Plus size={16} /> Create new package
          </button>
        </div>
      </section>

      {/* Package Metrics */}
      <section className="metrics-grid">
        <Metric
          label="Unlimited Plans"
          value={`${unlimitedCount} tiers`}
          change="Hours, Days, Weeks, Months"
          trend="up"
          icon={Infinity}
          accent="green"
        />
        <Metric
          label="Total Plans Sold"
          value={totalSales.toLocaleString()}
          change="18.4% this month"
          trend="up"
          icon={ReceiptText}
          accent="orange"
        />
        <Metric
          label="Total Package Revenue"
          value={`KSh ${totalRevenue.toLocaleString()}`}
          change="Lifetime volume"
          trend="up"
          icon={CircleDollarSign}
          accent="teal"
        />
        <Metric
          label="Multi-Device Plans"
          value={String(packages.filter((p) => p.device_limit > 1).length)}
          change="Family / Team tiers"
          trend="up"
          icon={Laptop}
          accent="blue"
        />
      </section>

      {/* Toolbar & Filter Tabs */}
      <div className="router-toolbar">
        <div className="router-search-box">
          <Search size={16} color="var(--muted)" />
          <input
            type="text"
            placeholder="Search by package name, duration, price, unlimited..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 0, color: 'var(--muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All ({packages.length})
          </button>
          <button
            className={`filter-pill ${filterCategory === 'unlimited' ? 'active' : ''}`}
            onClick={() => setFilterCategory('unlimited')}
          >
            ♾️ Unlimited ({unlimitedCount})
          </button>
          <button
            className={`filter-pill ${filterCategory === 'hourly' ? 'active' : ''}`}
            onClick={() => setFilterCategory('hourly')}
          >
            Hourly ({packages.filter((p) => p.category === 'hourly').length})
          </button>
          <button
            className={`filter-pill ${filterCategory === 'daily' ? 'active' : ''}`}
            onClick={() => setFilterCategory('daily')}
          >
            Daily ({packages.filter((p) => p.category === 'daily').length})
          </button>
          <button
            className={`filter-pill ${filterCategory === 'weekly' ? 'active' : ''}`}
            onClick={() => setFilterCategory('weekly')}
          >
            Weekly ({packages.filter((p) => p.category === 'weekly').length})
          </button>
          <button
            className={`filter-pill ${filterCategory === 'monthly' ? 'active' : ''}`}
            onClick={() => setFilterCategory('monthly')}
          >
            Monthly ({packages.filter((p) => p.category === 'monthly').length})
          </button>
          <button
            className={`filter-pill ${filterCategory === 'multi-device' ? 'active' : ''}`}
            onClick={() => setFilterCategory('multi-device')}
          >
            Multi-Device ({packages.filter((p) => p.category === 'multi-device' || p.device_limit > 1).length})
          </button>
        </div>
      </div>

      {/* Package Cards Grid */}
      {filteredPackages.length === 0 ? (
        <div className="panel section-placeholder" style={{ minHeight: '220px', textAlign: 'center', alignItems: 'center' }}>
          <div className="placeholder-icon"><Ticket size={20} /></div>
          <h2>No matching packages found</h2>
          <p>Create a new package or choose a different category filter.</p>
        </div>
      ) : (
        <div className="package-cards-admin-grid">
          {filteredPackages.map((pkg) => {
            const isUnlimited = pkg.data_limit.toLowerCase().includes('unlimited')
            return (
              <div key={pkg.id} className={`package-admin-card ${pkg.is_active ? '' : 'inactive'}`}>
                <div className="package-card-header">
                  <div className="package-title-wrap">
                    <h3>{pkg.name}</h3>
                    <span className="package-category-tag">{pkg.category}</span>
                  </div>
                  <div className="customer-quick-actions">
                    {isUnlimited && (
                      <span className="package-unlimited-badge" title="Unlimited Data without throttling">
                        <Sparkles size={11} /> Unlimited
                      </span>
                    )}
                    <span
                      className={`package-device-badge ${pkg.device_limit > 1 ? 'multi' : ''}`}
                      title={`Allowed concurrent connections: ${pkg.device_limit} devices`}
                    >
                      {pkg.device_limit > 1 ? <Users size={12} /> : <Smartphone size={12} />}
                      {pkg.device_limit} {pkg.device_limit > 1 ? 'Devices' : 'Device'}
                    </span>
                  </div>
                </div>

                <div className="package-price-display">
                  <strong>KSh {pkg.price.toLocaleString()}</strong>
                  <span>/ {pkg.duration_display}</span>
                </div>

                {/* Features List */}
                <div className="package-features-list">
                  <div className="package-feature-item">
                    <Clock3 size={13} />
                    <span>Duration: <strong>{pkg.duration_display}</strong></span>
                  </div>
                  <div className="package-feature-item">
                    <Zap size={13} />
                    <span>Data Quota: <strong style={{ color: isUnlimited ? 'var(--green)' : 'inherit' }}>{pkg.data_limit}</strong></span>
                  </div>
                  <div className="package-feature-item">
                    <Gauge size={13} />
                    <span>Bandwidth Cap: <strong>{pkg.speed_limit}</strong></span>
                  </div>
                  <div className="package-feature-item">
                    <Users size={13} />
                    <span>Concurrency: <strong>{pkg.device_limit} simultaneous device{pkg.device_limit > 1 ? 's' : ''}</strong></span>
                  </div>
                </div>

                {/* Sales Statistics */}
                <div className="package-sales-stats">
                  <span>Total Sold: <strong>{pkg.sales_count} plans</strong></span>
                  <span>Revenue: <strong>KSh {(pkg.price * (pkg.sales_count || 1)).toLocaleString()}</strong></span>
                </div>

                {/* Actions Row */}
                <div className="router-card-actions">
                  <button
                    className="router-action-btn"
                    onClick={() => onGenerateVouchersForPackage(pkg.name)}
                    title="Generate access vouchers for this package"
                  >
                    <Ticket size={13} /> Generate Vouchers
                  </button>
                  <button
                    className="router-action-btn"
                    onClick={() => onToggleActive(pkg.id)}
                    title={pkg.is_active ? 'Pause package (hide from sales)' : 'Activate package'}
                  >
                    {pkg.is_active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    className="router-delete-btn"
                    onClick={() => onDelete(pkg.id, pkg.name)}
                    title="Delete package"
                    aria-label={`Delete ${pkg.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CustomersManagementView({
  customers,
  onToggleBlock,
  onDelete,
  onExportCSV,
  onAddNewClick,
}: {
  customers: CustomerRecord[]
  onToggleBlock: (customer: CustomerRecord) => void
  onDelete: (id: string, name: string) => void
  onExportCSV: () => void
  onAddNewClick: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'idle' | 'blocked'>('all')

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plan.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || c.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const activeCount = customers.filter((c) => c.status === 'active').length
  const blockedCount = customers.filter((c) => c.status === 'blocked').length

  return (
    <div className="customers-view">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Directory & Access Control</p>
          <h1>Customer Management</h1>
          <p className="heading-sub">
            Track customer hotspot subscriptions, data consumption, payment history, and device access.
          </p>
        </div>
        <div className="heading-actions">
          <button className="button secondary" onClick={onExportCSV}>
            <Download size={15} /> Export CSV
          </button>
          <button className="button primary" onClick={onAddNewClick}>
            <UserPlus size={16} /> Add customer
          </button>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="metrics-grid">
        <Metric
          label="Total Subscribers"
          value={String(customers.length + 1278)}
          change="12.6%"
          trend="up"
          icon={Users}
          accent="orange"
        />
        <Metric
          label="Online Now"
          value={`${activeCount} connected`}
          change="Live on APs"
          trend="up"
          icon={Wifi}
          accent="green"
        />
        <Metric
          label="Average Customer Value"
          value="KSh 1,220"
          change="8.4%"
          trend="up"
          icon={CircleDollarSign}
          accent="teal"
        />
        <Metric
          label="Blocked Devices"
          value={`${blockedCount} banned`}
          change="Access restricted"
          trend="down"
          icon={Ban}
          accent="blue"
        />
      </section>

      {/* Toolbar: Search & Filters */}
      <div className="router-toolbar">
        <div className="router-search-box">
          <Search size={16} color="var(--muted)" />
          <input
            type="text"
            placeholder="Search by customer name, phone, device, or plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 0, color: 'var(--muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({customers.length})
          </button>
          <button
            className={`filter-pill ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active Now ({activeCount})
          </button>
          <button
            className={`filter-pill ${filterStatus === 'idle' ? 'active' : ''}`}
            onClick={() => setFilterStatus('idle')}
          >
            Idle ({customers.filter((c) => c.status === 'idle').length})
          </button>
          <button
            className={`filter-pill ${filterStatus === 'blocked' ? 'active' : ''}`}
            onClick={() => setFilterStatus('blocked')}
          >
            Blocked ({blockedCount})
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="panel" style={{ padding: '0 20px 14px' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Device Info</th>
                <th>Current Plan</th>
                <th>Total Spent</th>
                <th>Data Consumed</th>
                <th>Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px 0', color: 'var(--muted)' }}>
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar" style={{ background: customer.avatar_color }}>
                          {customer.name.split(' ').map((w) => w[0]).join('')}
                        </div>
                        <div>
                          <strong>{customer.name}</strong>
                          <span>ID: {customer.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--ink)' }}>
                        <Phone size={13} color="var(--muted)" /> {customer.phone}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--ink)' }}>
                        <Smartphone size={13} color="var(--muted)" /> {customer.device}
                      </span>
                    </td>
                    <td><span className="package-name">{customer.plan}</span></td>
                    <td><strong>{customer.total_spent}</strong></td>
                    <td><span className="muted">{customer.data_usage}</span></td>
                    <td>
                      <span className={`customer-status-badge ${customer.status}`}>
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background:
                              customer.status === 'active'
                                ? '#4ca574'
                                : customer.status === 'idle'
                                ? '#87928b'
                                : '#d9554f',
                          }}
                        />
                        {customer.status === 'active' ? 'Online' : customer.status === 'idle' ? 'Offline' : 'Blocked'}
                      </span>
                    </td>
                    <td><span className="muted">{customer.last_active}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="customer-quick-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className={`customer-icon-btn ${customer.status === 'blocked' ? '' : 'danger'}`}
                          title={customer.status === 'blocked' ? 'Unblock customer Wi-Fi access' : 'Block customer device MAC'}
                          onClick={() => onToggleBlock(customer)}
                        >
                          {customer.status === 'blocked' ? <UserCheck size={14} color="#4ca574" /> : <UserX size={14} />}
                        </button>
                        <button
                          className="customer-icon-btn danger"
                          title="Delete customer record"
                          onClick={() => onDelete(customer.id, customer.name)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function RoutersManagementView({
  routers,
  onPing,
  onReboot,
  onDelete,
  onAddNewClick,
}: {
  routers: RouterDevice[]
  onPing: (router: RouterDevice) => void
  onReboot: (router: RouterDevice) => void
  onDelete: (id: string, name: string) => void
  onAddNewClick: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'good' | 'warn' | 'down'>('all')

  const filteredRouters = routers.filter((router) => {
    const matchesSearch =
      router.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.ip_address.includes(searchQuery) ||
      router.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      router.model.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || router.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const onlineCount = routers.filter((r) => r.status === 'good').length
  const totalClients = routers.reduce((acc, curr) => acc + curr.clients_count, 0)

  return (
    <div className="routers-view">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Infrastructure & Gateways</p>
          <h1>Routers & Access Points</h1>
          <p className="heading-sub">
            Monitor and manage MikroTik gateways, RADIUS controllers, and Wi-Fi access points.
          </p>
        </div>
        <div className="heading-actions">
          <button className="button secondary" onClick={() => window.location.reload()}>
            <RefreshCw size={15} /> Scan network
          </button>
          <button className="button primary" onClick={onAddNewClick}>
            <Plus size={16} /> Add new router / AP
          </button>
        </div>
      </section>

      {/* Network Overview Summary Metrics */}
      <section className="metrics-grid">
        <Metric
          label="Online Gateways"
          value={`${onlineCount} / ${routers.length}`}
          change="100% Uptime"
          trend="up"
          icon={Server}
          accent="green"
        />
        <Metric
          label="Connected Hotspot Users"
          value={String(totalClients)}
          change="Across all APs"
          trend="up"
          icon={Users}
          accent="orange"
        />
        <Metric
          label="Total Bandwidth Draw"
          value="136.9 Mbps"
          change="68% of 200M line"
          trend="up"
          icon={Activity}
          accent="teal"
        />
        <Metric
          label="Avg. Gateway Ping"
          value="2.8 ms"
          change="Ultra-low latency"
          trend="up"
          icon={Radio}
          accent="blue"
        />
      </section>

      {/* Search & Filter Toolbar */}
      <div className="router-toolbar">
        <div className="router-search-box">
          <Search size={16} color="var(--muted)" />
          <input
            type="text"
            placeholder="Search by name, IP, model, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 0, color: 'var(--muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({routers.length})
          </button>
          <button
            className={`filter-pill ${filterStatus === 'good' ? 'active' : ''}`}
            onClick={() => setFilterStatus('good')}
          >
            Online ({onlineCount})
          </button>
          <button
            className={`filter-pill ${filterStatus === 'warn' ? 'active' : ''}`}
            onClick={() => setFilterStatus('warn')}
          >
            Warning ({routers.filter((r) => r.status === 'warn').length})
          </button>
          <button
            className={`filter-pill ${filterStatus === 'down' ? 'active' : ''}`}
            onClick={() => setFilterStatus('down')}
          >
            Down ({routers.filter((r) => r.status === 'down').length})
          </button>
        </div>
      </div>

      {/* Router Cards Grid */}
      {filteredRouters.length === 0 ? (
        <div className="panel section-placeholder" style={{ minHeight: '220px', textAlign: 'center', alignItems: 'center' }}>
          <div className="placeholder-icon"><WifiOff size={20} /></div>
          <h2>No matching routers found</h2>
          <p>Try adjusting your search query or status filter.</p>
        </div>
      ) : (
        <div className="router-cards-grid">
          {filteredRouters.map((router) => (
            <div key={router.id} className="router-item-card">
              {/* Header */}
              <div className="router-card-header">
                <div className="router-identity">
                  <div className="router-icon-wrap">
                    <Router size={22} />
                  </div>
                  <div>
                    <h3>{router.name}</h3>
                    <span>{router.model}</span>
                  </div>
                </div>
                <span className={`router-badge ${router.status}`}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background:
                        router.status === 'good'
                          ? '#4ca574'
                          : router.status === 'warn'
                          ? '#dca642'
                          : '#d9554f',
                    }}
                  />
                  {router.status === 'good' ? 'Online' : router.status === 'warn' ? 'Warning' : 'Offline'}
                </span>
              </div>

              {/* IP, Location & Clients Grid */}
              <div className="router-details-grid">
                <div className="router-detail-item">
                  <span>IP Address</span>
                  <strong>{router.ip_address}</strong>
                </div>
                <div className="router-detail-item">
                  <span>Location</span>
                  <strong>{router.location}</strong>
                </div>
                <div className="router-detail-item">
                  <span>Active Clients</span>
                  <strong>{router.clients_count} devices</strong>
                </div>
                <div className="router-detail-item">
                  <span>Ping Latency</span>
                  <strong style={{ color: router.ping_ms > 10 ? 'var(--coral)' : 'var(--green)' }}>
                    {router.ping_ms} ms
                  </strong>
                </div>
              </div>

              {/* Performance Section: Traffic & CPU */}
              <div className="router-perf-section">
                <div className="router-perf-row">
                  <span>Live Traffic (Down / Up)</span>
                  <strong>{router.traffic_down} ↓ / {router.traffic_up} ↑</strong>
                </div>
                <div className="usage-bar" style={{ height: 6 }}>
                  <i style={{ width: `${Math.min(100, router.cpu_load + 20)}%`, background: router.cpu_load > 60 ? 'var(--coral)' : 'var(--green)' }} />
                </div>
                <div className="router-perf-row" style={{ fontSize: '10px' }}>
                  <span>CPU: {router.cpu_load}% · RAM: {router.ram_load}%</span>
                  <span>Uptime: {router.uptime}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="router-card-actions">
                <button
                  className="router-action-btn"
                  onClick={() => onPing(router)}
                  title="Test router latency and ICMP ping"
                >
                  <Radio size={13} /> Ping
                </button>
                <button
                  className="router-action-btn"
                  onClick={() => onReboot(router)}
                  title="Reboot RouterOS"
                >
                  <RefreshCw size={13} /> Reboot
                </button>
                <button
                  className="router-delete-btn"
                  onClick={() => onDelete(router.id, router.name)}
                  title="Delete router from workspace"
                  aria-label={`Delete ${router.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, change, trend, icon: Icon, accent }: { label: string; value: string; change: string; trend: 'up' | 'down'; icon: typeof Activity; accent: string }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${accent}`}><Icon size={19} /></div>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={trend === 'down' ? 'negative' : 'positive'}>
          {trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {change} <em>vs last month</em>
        </small>
      </div>
    </div>
  )
}

function HealthRow({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="health-row">
      <span><i className={`health-dot ${status}`} />{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function PackageRow({ name, sales, amount, width, color }: { name: string; sales: string; amount: string; width: string; color: string }) {
  return (
    <div className="package-row">
      <div className="package-top">
        <div><strong>{name}</strong><span>{sales}</span></div>
        <b>{amount}</b>
      </div>
      <div className="package-bar"><i className={color} style={{ width }} /></div>
    </div>
  )
}

function SectionPlaceholder({ section }: { section: string }) {
  return (
    <section className="panel section-placeholder">
      <div className="placeholder-icon"><LayoutDashboard size={20} /></div>
      <p className="eyebrow">Workspace module</p>
      <h2>{section} is coming into focus</h2>
      <p>Connect this module to the Harbor House workspace to manage it from the same operator command center.</p>
      <button className="button secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ArrowUpRight size={15} /></button>
    </section>
  )
}

function RevenueChart() {
  return (
    <div className="chart">
      <div className="chart-grid"><span /><span /><span /><span /></div>
      <svg viewBox="0 0 720 180" preserveAspectRatio="none" role="img" aria-label="Revenue trend">
        <defs>
          <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#d36b4d" stopOpacity=".24" />
            <stop offset="1" stopColor="#d36b4d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 145 C40 142 46 120 83 129 S125 146 165 105 S208 98 242 113 S276 128 315 91 S350 74 390 84 S426 105 465 67 S500 78 535 55 S575 72 612 38 S650 48 720 15 L720 180 L0 180Z" fill="url(#fill)" />
        <path d="M0 145 C40 142 46 120 83 129 S125 146 165 105 S208 98 242 113 S276 128 315 91 S350 74 390 84 S426 105 465 67 S500 78 535 55 S575 72 612 38 S650 48 720 15" fill="none" stroke="#d36b4d" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="chart-labels">
        <span>Aug 01</span>
        <span>Aug 08</span>
        <span>Aug 15</span>
        <span>Aug 22</span>
        <span>Aug 31</span>
      </div>
    </div>
  )
}

export default App
