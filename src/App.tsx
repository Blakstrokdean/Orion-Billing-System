import { useEffect, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Bolt, ChevronDown, CircleDollarSign,
  Clock3, CreditCard, Gauge, LayoutDashboard, LifeBuoy, MoreHorizontal, Network,
  Plus, ReceiptText, Router, Search, Settings2, ShieldCheck, Signal, Ticket, Users,
  Wifi, X, Zap,
} from 'lucide-react'
import { supabase } from './lib/supabase'
import type { Factor } from '@supabase/supabase-js'

type Session = { id?: string; name: string; device: string; location: string; plan: string; usage: string; progress: number; color: string }

const initialSessions: Session[] = [
  { name: 'Maya Ochieng', device: 'iPhone 14 Pro', location: 'Lobby AP · 10.20.0.34', plan: '24 hour pass', usage: '1.2 GB / 5 GB', progress: 24, color: '#d36b4d' },
  { name: 'Brian Kamau', device: 'MacBook Air', location: 'Poolside AP · 10.20.0.52', plan: '7 day access', usage: '8.4 GB / 20 GB', progress: 42, color: '#317d75' },
  { name: 'Aisha Wanjiku', device: 'Galaxy S24', location: 'Cafe AP · 10.20.1.18', plan: '1 hour pass', usage: '680 MB / 1 GB', progress: 68, color: '#c58a32' },
]

const transactions = [
  { id: '#TRX-2091', customer: 'Maya Ochieng', method: 'M-Pesa', package: '24 hour pass', amount: 'KSh 250', status: 'Paid', time: 'Today, 09:42' },
  { id: '#TRX-2090', customer: 'Peter Mwangi', method: 'Voucher', package: '1 hour pass', amount: 'KSh 50', status: 'Paid', time: 'Today, 09:26' },
  { id: '#TRX-2089', customer: 'Grace Njeri', method: 'M-Pesa', package: '7 day access', amount: 'KSh 1,200', status: 'Paid', time: 'Today, 08:58' },
  { id: '#TRX-2088', customer: 'Samuel Kibet', method: 'Airtel Money', package: '5 GB data', amount: 'KSh 500', status: 'Pending', time: 'Today, 08:44' },
]

function App() {
  const [authReady, setAuthReady] = useState(!supabase)
  const [operator, setOperator] = useState<{ email?: string } | null>(null)

  useEffect(() => {
    const client = supabase
    if (!client) return
    client.auth.getSession().then(async ({ data }) => {
      const { data: assurance } = await client.auth.mfa.getAuthenticatorAssuranceLevel()
      setOperator(assurance?.currentLevel === 'aal2' ? data.session?.user ?? null : null)
      setAuthReady(true)
    })
    const { data: listener } = client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setOperator(null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!authReady) return <AuthLoading />
  if (supabase && !operator) return <OperatorSignIn onSignedIn={setOperator} />

  return <OperatorDashboard operatorEmail={operator?.email} />
}

function OperatorDashboard({ operatorEmail }: { operatorEmail?: string }) {
  const [activeNav, setActiveNav] = useState('Overview')
  const [sessions, setSessions] = useState(initialSessions)
  const [showVoucher, setShowVoucher] = useState(false)
  const [voucherPackage, setVoucherPackage] = useState('24 hour pass')
  const [voucherCount, setVoucherCount] = useState(10)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const client = supabase
    if (!client) return

    const loadSessions = async () => {
      const { data, error } = await client
        .from('hotspot_sessions')
        .select('id, customer_name, device, location, plan, usage, progress, color')
        .is('disconnected_at', null)
        .order('connected_at', { ascending: false })

      if (error) {
        setNotice(`Supabase connection failed: ${error.message}`)
        return
      }

      setSessions((data ?? []).map((session) => ({
        id: session.id,
        name: session.customer_name,
        device: session.device,
        location: session.location,
        plan: session.plan,
        usage: session.usage,
        progress: session.progress,
        color: session.color,
      })))
    }

    void loadSessions()
  }, [])

  const disconnect = async (session: Session) => {
    const client = supabase
    if (client && session.id) {
      const { error } = await client
        .from('hotspot_sessions')
        .update({ disconnected_at: new Date().toISOString() })
        .eq('id', session.id)

      if (error) {
        setNotice(`Could not disconnect ${session.name}: ${error.message}`)
        return
      }
    }

    setSessions((current) => current.filter((item) => item.id ? item.id !== session.id : item.name !== session.name))
    setNotice(`${session.name} disconnected`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  const generateVouchers = async () => {
    const count = Math.max(1, Math.floor(voucherCount))
    const client = supabase
    if (client) {
      const vouchers = Array.from({ length: count }, () => ({
        code: crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase(),
        package_name: voucherPackage,
      }))
      const { error } = await client.from('vouchers').insert(vouchers)
      if (error) {
        setNotice(`Could not generate vouchers: ${error.message}`)
        return
      }
    }

    setShowVoucher(false)
    setNotice(`${count} vouchers generated successfully`)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Signal size={20} /></div><span>orion<span className="brand-dot">.</span></span></div>
        <div className="workspace-switcher"><div className="workspace-avatar">H</div><div><strong>Harbor House</strong><span>Westlands, Nairobi</span></div><ChevronDown size={15} /></div>
        <nav>
          <p className="nav-label">Workspace</p>
          {[
            ['Overview', LayoutDashboard], ['Customers', Users], ['Packages', Ticket], ['Vouchers', ReceiptText],
            ['Transactions', CreditCard], ['Routers', Router],
          ].map(([label, Icon]) => <button key={label as string} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label as string)}><Icon size={18} /><span>{label as string}</span>{label === 'Vouchers' && <b className="nav-count">12</b>}</button>)}
          <p className="nav-label support-label">Manage</p>
          {[["Reports", Activity], ["Settings", Settings2]].map(([label, Icon]) => <button key={label as string} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label as string)}><Icon size={18} /><span>{label as string}</span></button>)}
        </nav>
        <div className="sidebar-bottom"><div className="help-box"><div className="help-icon"><LifeBuoy size={17} /></div><strong>Need a hand?</strong><span>Visit the help center</span></div><div className="profile"><div className="profile-avatar">JM</div><div><strong>{operatorEmail ?? 'Janet Muthoni'}</strong><span>Owner</span></div><MoreHorizontal size={18} /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Harbor House</span><span>/</span><strong>{activeNav}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Search" onClick={() => setNotice('Search is ready for your workspace')}><Search size={19} /></button><button className="icon-button notification" aria-label="Notifications" onClick={() => setNotice('You are all caught up')}><Bell size={19} /><i /></button><div className="date-control"><Clock3 size={16} /> Aug 01 – Aug 31 <ChevronDown size={14} /></div></div></header>
        <div className="page-wrap">
           <section className="page-heading"><div><p className="eyebrow">Wednesday, August 26, 2026</p><h1>{activeNav === 'Overview' ? <>Good morning, Janet <span>✦</span></> : activeNav}</h1><p className="heading-sub">{activeNav === 'Overview' ? 'Here is what is happening across your hotspot today.' : `${activeNav} workspace tools are ready to be connected to your live hotspot data.`}</p></div><div className="heading-actions"><button className="button secondary" onClick={() => setNotice('Report export prepared')}><ArrowDownRight size={16} /> Export report</button><button className="button primary" onClick={() => setShowVoucher(true)}><Plus size={17} /> Create voucher</button></div></section>

           {activeNav !== 'Overview' && <SectionPlaceholder section={activeNav} />}

          <section className="metrics-grid"><Metric label="Total revenue" value="KSh 284,650" change="18.4%" trend="up" icon={CircleDollarSign} accent="green" /><Metric label="Active customers" value="1,284" change="12.6%" trend="up" icon={Users} accent="orange" /><Metric label="Live sessions" value={String(sessions.length + 146)} change="4.2%" trend="up" icon={Wifi} accent="teal" /><Metric label="Avg. session time" value="3h 42m" change="8.1%" trend="down" icon={Gauge} accent="blue" /></section>

          <div className="content-grid"><section className="panel revenue-panel"><div className="panel-heading"><div><h2>Revenue overview</h2><p>Monthly income from all access packages</p></div><button className="select-button">Last 30 days <ChevronDown size={14} /></button></div><div className="revenue-total"><strong>KSh 284,650</strong><span className="positive"><ArrowUpRight size={14} /> 18.4%</span></div><RevenueChart /></section><section className="panel network-panel"><div className="panel-heading"><div><h2>Network health</h2><p>All systems are operational</p></div><span className="live-pill"><i /> Live</span></div><div className="network-score"><div className="score-ring"><strong>98</strong><span>/100</span></div><div><strong>Excellent</strong><p>Uptime this month</p></div></div><div className="health-list"><HealthRow label="MikroTik routers" value="3 / 3 online" status="good" /><HealthRow label="Active access points" value="18 online" status="good" /><HealthRow label="Bandwidth usage" value="68% capacity" status="warn" /></div><button className="text-button" onClick={() => setActiveNav('Routers')}>View network details <ArrowUpRight size={15} /></button></section></div>

          <div className="content-grid lower-grid"><section className="panel sessions-panel"><div className="panel-heading"><div><h2>Live sessions <span className="heading-badge">{sessions.length + 146}</span></h2><p>Customers currently connected</p></div><button className="text-button" onClick={() => setActiveNav('Customers')}>View all <ArrowUpRight size={15} /></button></div><div className="table-wrap"><table><thead><tr><th>Customer</th><th>Package</th><th>Usage</th><th></th></tr></thead><tbody>{sessions.map((session) => <tr key={session.id ?? session.name}><td><div className="customer-cell"><div className="customer-avatar" style={{ background: session.color }}>{session.name.split(' ').map((word) => word[0]).join('')}</div><div><strong>{session.name}</strong><span>{session.device} · {session.location}</span></div></div></td><td><span className="package-name">{session.plan}</span></td><td><div className="usage-cell"><div className="usage-bar"><i style={{ width: `${session.progress}%` }} /></div><span>{session.usage}</span></div></td><td><button className="row-action" aria-label={`Disconnect ${session.name}`} onClick={() => void disconnect(session)}><X size={15} /></button></td></tr>)}</tbody></table></div></section><section className="panel package-panel"><div className="panel-heading"><div><h2>Popular packages</h2><p>Sales by access plan</p></div><button className="more-button" aria-label="More package options"><MoreHorizontal size={18} /></button></div><div className="package-list"><PackageRow name="24 hour pass" sales="486 sold" amount="KSh 121,500" width="82%" color="orange" /><PackageRow name="7 day access" sales="124 sold" amount="KSh 148,800" width="68%" color="teal" /><PackageRow name="1 hour pass" sales="287 sold" amount="KSh 14,350" width="48%" color="yellow" /></div><button className="outline-button" onClick={() => setActiveNav('Packages')}>Manage packages <ArrowUpRight size={15} /></button></section></div>

          <section className="panel transactions-panel"><div className="panel-heading"><div><h2>Recent transactions</h2><p>Latest payments and voucher redemptions</p></div><button className="text-button" onClick={() => setActiveNav('Transactions')}>View all transactions <ArrowUpRight size={15} /></button></div><div className="table-wrap"><table><thead><tr><th>Transaction</th><th>Customer</th><th>Method</th><th>Package</th><th>Amount</th><th>Status</th><th>Time</th></tr></thead><tbody>{transactions.map((transaction) => <tr key={transaction.id}><td><strong className="transaction-id">{transaction.id}</strong></td><td>{transaction.customer}</td><td><span className="method"><span className={`method-dot ${transaction.method === 'M-Pesa' ? 'mpesa' : transaction.method === 'Voucher' ? 'voucher' : 'airtel'}`} />{transaction.method}</span></td><td>{transaction.package}</td><td><strong>{transaction.amount}</strong></td><td><span className={`status ${transaction.status.toLowerCase()}`}>{transaction.status}</span></td><td className="muted">{transaction.time}</td></tr>)}</tbody></table></div></section>
        </div>
      </main>
      {showVoucher && <div className="modal-backdrop" onClick={() => setShowVoucher(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowVoucher(false)}><X size={18} /></button><div className="modal-icon"><Ticket size={22} /></div><p className="eyebrow">Quick action</p><h2>Create vouchers</h2><p className="modal-copy">Generate a batch of access codes for your next walk-in customers.</p><label>Package<select value={voucherPackage} onChange={(event) => setVoucherPackage(event.target.value)}><option>24 hour pass</option><option>1 hour pass</option><option>7 day access</option></select></label><label>Number of vouchers<input type="number" value={voucherCount} onChange={(event) => setVoucherCount(Number(event.target.value))} min="1" /></label><button className="button primary full" onClick={() => void generateVouchers()}><Zap size={16} /> Generate vouchers</button></div></div>}
      {notice && <div className="toast"><ShieldCheck size={18} /> {notice}</div>}
    </div>
  )
}

function AuthLoading() {
  return <div className="auth-shell"><div className="auth-card"><div className="modal-icon"><ShieldCheck size={22} /></div><h1>Loading secure sign-in</h1><p>Checking your operator session.</p></div></div>
}

function OperatorSignIn({ onSignedIn }: { onSignedIn: (operator: { email?: string }) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [factor, setFactor] = useState<Factor | null>(null)
  const [enrollment, setEnrollment] = useState<{ id: string; qr_code: string; secret: string } | null>(null)
  const [step, setStep] = useState<'credentials' | 'mfa' | 'enroll'>('credentials')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submitCredentials = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError || !data.user) {
      setError(signInError?.message ?? 'Unable to sign in.')
      setBusy(false)
      return
    }
    const { data: factors, error: factorError } = await supabase.auth.mfa.listFactors()
    if (factorError) {
      setError(factorError.message)
    } else {
      const totp = factors.totp[0]
      if (totp) {
        setFactor(totp)
        setStep('mfa')
      } else {
        const { data: enrolled, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Orion operator authenticator' })
        if (enrollError || !enrolled?.totp) setError(enrollError?.message ?? 'Could not start 2FA enrollment.')
        else {
          setEnrollment({ id: enrolled.id, qr_code: enrolled.totp.qr_code, secret: enrolled.totp.secret })
          setStep('enroll')
        }
      }
    }
    setBusy(false)
  }

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!supabase || !code) return
    setBusy(true)
    setError('')
    const factorId = factor?.id ?? enrollment?.id
    if (!factorId) return
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) setError(challengeError.message)
    else {
      const { error: verifyError } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code })
      if (verifyError) setError(verifyError.message)
      else onSignedIn({ email })
    }
    setBusy(false)
  }

  return <div className="auth-shell"><form className="auth-card" onSubmit={step === 'credentials' ? submitCredentials : verifyCode}><div className="modal-icon"><ShieldCheck size={22} /></div><p className="eyebrow">Orion operator access</p><h1>{step === 'credentials' ? 'Sign in securely' : 'Verify your identity'}</h1>{step === 'credentials' ? <><p>Use your Supabase operator account to continue.</p><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label></> : <><p>{step === 'enroll' ? 'Scan the QR code with an authenticator app, then enter the six-digit code.' : 'Enter the six-digit code from your authenticator app.'}</p>{enrollment && <><img className="auth-qr" src={enrollment.qr_code} alt="Authenticator setup QR code" /><small>Can’t scan? Use this setup key: {enrollment.secret}</small></>}</>} {error && <p className="auth-error">{error}</p>} {step !== 'credentials' && <label>Authentication code<input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value)} required autoComplete="one-time-code" /></label>}<button className="button primary full" disabled={busy}>{busy ? 'Please wait…' : step === 'credentials' ? 'Continue' : 'Verify and continue'}</button></form></div>
}

function Metric({ label, value, change, trend, icon: Icon, accent }: { label: string; value: string; change: string; trend: 'up' | 'down'; icon: typeof Activity; accent: string }) { return <div className="metric-card"><div className={`metric-icon ${accent}`}><Icon size={19} /></div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><small className={trend === 'down' ? 'negative' : 'positive'}>{trend === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {change} <em>vs last month</em></small></div></div> }
function HealthRow({ label, value, status }: { label: string; value: string; status: string }) { return <div className="health-row"><span><i className={`health-dot ${status}`} />{label}</span><strong>{value}</strong></div> }
function PackageRow({ name, sales, amount, width, color }: { name: string; sales: string; amount: string; width: string; color: string }) { return <div className="package-row"><div className="package-top"><div><strong>{name}</strong><span>{sales}</span></div><b>{amount}</b></div><div className="package-bar"><i className={color} style={{ width }} /></div></div> }
function SectionPlaceholder({ section }: { section: string }) { return <section className="panel section-placeholder"><div className="placeholder-icon"><LayoutDashboard size={20} /></div><p className="eyebrow">Workspace module</p><h2>{section} is coming into focus</h2><p>Connect this module to the Harbor House workspace to manage it from the same operator command center.</p><button className="button secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ArrowUpRight size={15} /></button></section> }
function RevenueChart() { return <div className="chart"><div className="chart-grid"><span /><span /><span /><span /></div><svg viewBox="0 0 720 180" preserveAspectRatio="none" role="img" aria-label="Revenue trend"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d36b4d" stopOpacity=".24" /><stop offset="1" stopColor="#d36b4d" stopOpacity="0" /></linearGradient></defs><path d="M0 145 C40 142 46 120 83 129 S125 146 165 105 S208 98 242 113 S276 128 315 91 S350 74 390 84 S426 105 465 67 S500 78 535 55 S575 72 612 38 S650 48 720 15 L720 180 L0 180Z" fill="url(#fill)" /><path d="M0 145 C40 142 46 120 83 129 S125 146 165 105 S208 98 242 113 S276 128 315 91 S350 74 390 84 S426 105 465 67 S500 78 535 55 S575 72 612 38 S650 48 720 15" fill="none" stroke="#d36b4d" strokeWidth="3" strokeLinecap="round" /></svg><div className="chart-labels"><span>Aug 01</span><span>Aug 08</span><span>Aug 15</span><span>Aug 22</span><span>Aug 31</span></div></div> }

export default App
