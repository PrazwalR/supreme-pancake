'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CalendarIcon, Wallet, Upload, DollarSign, FileText, Building2 } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  title: z.string()
    .min(3, 'Bakery name must be at least 3 characters')
    .max(50, 'Bakery name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s&'-]+$/, 'Only letters, numbers, spaces, and common punctuation allowed'),
  
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  targetAmount: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be a valid positive number')
    .refine((val) => Number(val) >= 0.01, 'Minimum funding goal is 0.01 ETH')
    .refine((val) => Number(val) <= 10000, 'Maximum funding goal is 10,000 ETH'),
  
  deadline: z.date({
    required_error: 'Please select a deadline date',
  }).refine((date) => date > new Date(), 'Deadline must be in the future')
    .refine((date) => date <= new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'Deadline cannot be more than 1 year from now'),
  
  imageUrl: z.string()
    .url('Please enter a valid URL')
    .refine((url) => {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
      const isValidExtension = validExtensions.some(ext => url.toLowerCase().includes(ext))
      const isIpfs = url.startsWith('ipfs://') || url.includes('ipfs')
      return isValidExtension || isIpfs
    }, 'Must be a valid image URL or IPFS hash'),
  
  ownerAddress: z.string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Must be a valid Ethereum address')
})

type FormData = z.infer<typeof formSchema>

export default function CrowdForm() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      targetAmount: '',
      imageUrl: '',
      ownerAddress: '',
    },
  })

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        if (accounts.length > 0) {
          form.setValue('ownerAddress', accounts[0])
          setWalletConnected(true)
        }
      } else {
        alert('Please install MetaMask to connect your wallet')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // Convert date to timestamp
      const timestamp = Math.floor(data.deadline.getTime() / 1000)
      
      // Convert ETH to wei (multiply by 10^18)
      const targetAmountWei = (Number(data.targetAmount) * Math.pow(10, 18)).toString()
      
      const formattedData = {
        ...data,
        targetAmount: targetAmountWei,
        deadline: timestamp,
      }
      
      console.log('Form submitted:', formattedData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Bakery project created successfully!')
      form.reset()
      setWalletConnected(false)
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card className="w-full max-w-7xl border-2 border-black/20 rounded-3xl shadow-xl">
        <CardHeader className="space-y-1 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6" />
            <CardTitle className="text-2xl font-medium tracking-tight">
              Launch Your Bakery
            </CardTitle>
          </div>
          <CardDescription className="text-black/60 leading-relaxed">
            Create a funding campaign for your bakery startup. Fill in the details below to get started with your entrepreneurial journey.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Bakery Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sweet Dreams Bakery"
                        className="border-black/20 focus:border-black transition-colors rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-black/50">
                      Choose a memorable name for your bakery (3-50 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your bakery concept, funding needs, and what makes your bakery special. Include details about your target market, unique offerings, and how the funds will be used..."
                        className="min-h-[120px] border-black/20 focus:border-black transition-colors resize-none rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-black/50">
                      Provide a detailed description of your bakery project (50-1000 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Funding Goal (ETH)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="10000"
                          placeholder="5.0"
                          className="border-black/20 focus:border-black transition-colors rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-black/50">
                        Amount in ETH (0.01 - 10,000)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Campaign Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal border-black/20 hover:border-black transition-colors rounded-xl",
                                !field.value && "text-black/50"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date > new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="text-xs text-black/50">
                        Campaign end date (max 1 year)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Project Image
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/bakery-image.jpg or ipfs://..."
                        className="border-black/20 focus:border-black transition-colors rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-black/50">
                      Image URL or IPFS hash for your bakery project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Owner Address
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="0x..."
                          className="border-black/20 focus:border-black transition-colors rounded-xl"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={connectWallet}
                        disabled={isConnecting || walletConnected}
                        className="border-black/20 hover:border-black transition-colors rounded-xl"
                      >
                        {isConnecting ? 'Connecting...' : walletConnected ? 'Connected' : 'Connect'}
                      </Button>
                    </div>
                    <FormDescription className="text-xs text-black/50">
                      Connect your wallet to auto-populate your address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-black/90 text-white transition-colors rounded-xl"
                >
                  {isSubmitting ? 'Creating Project...' : 'Launch Bakery Project'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
