'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Loader2, User, Lock, Mail, ArrowRight, Building } from 'lucide-react'
import logo from  "../../../public/crm-logo.png"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (formData.password !== formData.confirmPassword) {
        setErrorMsg('Passwords do not match')
        return
    }
    
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] bg-red-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center mb-2">
         <div className="h-12 w-12 rounded-2xl shadow-lg flex items-center justify-center mb-4">
             <img
            src={logo.src}
            alt="Logo"
            className="w-10 h-10 rounded-xl object-contain"
          />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join the CRM Portal</p>
        </div>

        <Card className="w-full border-none shadow-2xl shadow-slate-200 dark:shadow-black rounded-3xl backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
          <CardHeader className="space-y-1 pt-8 px-8">
            <CardTitle className="text-2xl font-semibold">Get Started</CardTitle>
            <CardDescription>Sign up to access and manage the unified control panel.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4 px-8">
              {errorMsg && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl font-medium flex items-center">
                  {errorMsg}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                   <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input 
                     id="name" 
                     type="text" 
                     placeholder="Alexander Smith" 
                     className="pl-10 rounded-xl h-11 bg-slate-100/50 dark:bg-slate-800/50 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-[#c24141]"
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     required
                   />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
                <div className="relative">
                   <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input 
                     id="companyName" 
                     type="text" 
                     placeholder="Acme Corporation" 
                     className="pl-10 rounded-xl h-11 bg-slate-100/50 dark:bg-slate-800/50 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-[#c24141]"
                     value={formData.companyName}
                     onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                     required
                   />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                   <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Input 
                     id="email" 
                     type="email" 
                     placeholder="name@company.com" 
                     className="pl-10 rounded-xl h-11 bg-slate-100/50 dark:bg-slate-800/50 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-[#c24141]"
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     required
                   />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="rounded-xl h-11 bg-slate-100/50 dark:bg-slate-800/50 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-[#c24141]"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                 </div>
                 <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      className="rounded-xl h-11 bg-slate-100/50 dark:bg-slate-800/50 border-transparent focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-[#c24141]"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                    />
                 </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4 pb-8 px-8">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#c24141] hover:bg-[#a63535] text-white h-11 rounded-xl text-base font-semibold transition-all duration-300 active:scale-[0.98]"
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registering...</>
                ) : (
                  <><span className="mr-1">Create Account</span> <ArrowRight className="h-4 w-4 ml-1" /></>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground mt-2">
                 Already registered?{" "}
                 <Link href="/login" className="text-[#c24141] hover:underline font-semibold">
                   Log In
                 </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
