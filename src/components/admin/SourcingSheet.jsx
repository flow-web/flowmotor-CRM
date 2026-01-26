import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calculator, Car, X, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'

import { CAR_MAKES, VEHICLE_STATUS, VEHICLE_STATUS_LABELS, CURRENCIES, ORIGIN_COUNTRIES } from '@/admin/utils/constants'

// Validation schema
const vehicleSchema = z.object({
  vin: z.string().optional(),
  make: z.string().min(1, 'La marque est requise'),
  model: z.string().min(1, 'Le modèle est requis'),
  year: z.coerce.number()
    .min(1900, 'Année invalide')
    .max(new Date().getFullYear() + 1, 'Année invalide'),
  mileage: z.coerce.number().min(0, 'Kilométrage invalide').default(0),
  color: z.string().optional(),
  purchasePrice: z.coerce.number().min(0, 'Prix invalide').default(0),
  currency: z.string().default('EUR'),
  exchangeRate: z.coerce.number().min(0).default(1),
  originCountry: z.string().optional(),
  sellingPrice: z.coerce.number().min(0, 'Prix invalide').default(0),
  targetMargin: z.coerce.number().min(0).max(100).default(15),
  status: z.string().default('SOURCING'),
  notes: z.string().optional(),
})

// Frais forfaitaires estimés (transport, admin, etc.)
const ESTIMATED_FEES = {
  transport: 800,
  admin: 200,
  preparation: 500,
  total: 1500
}

export default function SourcingSheet({
  open,
  onOpenChange,
  onSubmit,
  initialData = null,
  isLoading = false
}) {
  const isEdit = !!initialData

  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vin: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      color: '',
      purchasePrice: 0,
      currency: 'EUR',
      exchangeRate: 1,
      originCountry: '',
      sellingPrice: 0,
      targetMargin: 15,
      status: 'SOURCING',
      notes: '',
      ...initialData
    }
  })

  // Watch fields for margin calculation
  const purchasePrice = form.watch('purchasePrice')
  const sellingPrice = form.watch('sellingPrice')
  const currency = form.watch('currency')
  const exchangeRate = form.watch('exchangeRate')
  const targetMargin = form.watch('targetMargin')

  // Calculate margin in real-time
  const marginCalculation = useMemo(() => {
    const purchasePriceEUR = purchasePrice * exchangeRate
    const totalCost = purchasePriceEUR + ESTIMATED_FEES.total
    const margin = sellingPrice - totalCost
    const marginPercent = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0

    // Calculate suggested selling price based on target margin
    const suggestedPrice = totalCost / (1 - targetMargin / 100)

    return {
      purchasePriceEUR,
      totalCost,
      margin,
      marginPercent,
      suggestedPrice,
      isProfitable: margin > 0
    }
  }, [purchasePrice, sellingPrice, exchangeRate, targetMargin])

  // Auto-suggest selling price when target margin changes
  const applySuggestedPrice = () => {
    form.setValue('sellingPrice', Math.round(marginCalculation.suggestedPrice))
  }

  // Reset form when sheet closes or initialData changes
  useEffect(() => {
    if (open) {
      form.reset({
        vin: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: 0,
        color: '',
        purchasePrice: 0,
        currency: 'EUR',
        exchangeRate: 1,
        originCountry: '',
        sellingPrice: 0,
        targetMargin: 15,
        status: 'SOURCING',
        notes: '',
        ...initialData
      })
    }
  }, [open, initialData, form])

  const handleSubmit = async (data) => {
    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch (error) {
      console.error('Erreur soumission:', error)
    }
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto dark bg-background">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Car className="w-5 h-5" />
            {isEdit ? 'Modifier le véhicule' : 'Nouveau véhicule'}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {isEdit
              ? 'Modifiez les informations du véhicule'
              : 'Ajoutez un nouveau véhicule au sourcing'
            }
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-6">
            {/* Identification Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Identification
              </h3>

              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN (optionnel)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="WVWZZZ3CZWE123456"
                        className="bg-secondary/50 border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marque *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/50 border-border">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CAR_MAKES.map(make => (
                            <SelectItem key={make} value={make}>{make}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modèle *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex: Golf GTI"
                          className="bg-secondary/50 border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Année *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-secondary/50 border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kilométrage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-secondary/50 border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Noir"
                          className="bg-secondary/50 border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Tarification
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix d'achat</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-secondary/50 border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/50 border-border">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(CURRENCIES).map(([code, currency]) => (
                            <SelectItem key={code} value={code}>
                              {currency.symbol} {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {currency !== 'EUR' && (
                  <FormField
                    control={form.control}
                    name="exchangeRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taux de change</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.0001"
                            className="bg-secondary/50 border-border"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix de vente</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="bg-secondary/50 border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetMargin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marge cible (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          className="bg-secondary/50 border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Margin Calculator */}
            <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calculator size={16} />
                  Calculateur de marge
                </h4>
                {marginCalculation.isProfitable ? (
                  <Badge variant="outline" className="text-green-500 border-green-500/50">
                    <TrendingUp size={12} className="mr-1" />
                    Rentable
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-destructive border-destructive/50">
                    <TrendingDown size={12} className="mr-1" />
                    Non rentable
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Prix achat (EUR)</p>
                  <p className="font-medium text-foreground">
                    {formatPrice(marginCalculation.purchasePriceEUR)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Frais estimés</p>
                  <p className="font-medium text-foreground">
                    {formatPrice(ESTIMATED_FEES.total)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Coût total (PRU)</p>
                  <p className="font-semibold text-foreground">
                    {formatPrice(marginCalculation.totalCost)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Marge brute</p>
                  <p className={`font-semibold ${marginCalculation.isProfitable ? 'text-green-500' : 'text-destructive'}`}>
                    {formatPrice(marginCalculation.margin)}
                    <span className="text-xs ml-1">
                      ({marginCalculation.marginPercent.toFixed(1)}%)
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Prix suggéré ({targetMargin}% marge)</p>
                    <p className="font-semibold text-accent">
                      {formatPrice(marginCalculation.suggestedPrice)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={applySuggestedPrice}
                    className="text-xs"
                  >
                    Appliquer
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground flex items-start gap-1 pt-2">
                <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                <span>
                  Frais forfaitaires: Transport ({formatPrice(ESTIMATED_FEES.transport)}),
                  Admin ({formatPrice(ESTIMATED_FEES.admin)}),
                  Préparation ({formatPrice(ESTIMATED_FEES.preparation)})
                </span>
              </div>
            </div>

            {/* Status & Origin */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Statut & Origine
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/50 border-border">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(VEHICLE_STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays d'origine</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex: Allemagne"
                          className="bg-secondary/50 border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full min-h-[80px] rounded-lg bg-secondary/50 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Informations supplémentaires..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="flex gap-2 pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Annuler
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isLoading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Ajouter'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
