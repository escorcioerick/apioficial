import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Rotas da calculadora
  calculator: router({
    calculate: publicProcedure
      .input(z.object({
        country: z.string(),
        volume: z.number().int().positive(),
        messageType: z.enum(["marketing", "utility", "authentication"]),
        currency: z.enum(["USD", "BRL"]),
      }))
      .mutation(async ({ input }) => {
        // Taxas oficiais WhatsApp Business API - Brasil (vigência: julho 2025)
        // Fonte: https://business.whatsapp.com/products/platform-pricing
        const baseRates = {
          marketing: 0.0625,      // Marketing: sempre cobrado
          utility: 0.0080,        // Utility: gratuito dentro da janela de 24h
          authentication: 0.0315, // Authentication: sempre cobrado (com volume tiers)
        };

        // Volume tiers e descontos (apenas para utility e authentication)
        const getDiscountedRate = (baseRate: number, volume: number, messageType: string) => {
          if (messageType === "marketing") return baseRate;

          if (volume <= 250000) return baseRate;
          if (volume <= 2000000) return baseRate * 0.95; // -5%
          if (volume <= 17000000) return baseRate * 0.90; // -10%
          if (volume <= 35000000) return baseRate * 0.85; // -15%
          if (volume <= 70000000) return baseRate * 0.80; // -20%
          return baseRate * 0.75; // -25%
        };

        const baseRate = baseRates[input.messageType];
        const discountedRate = getDiscountedRate(baseRate, input.volume, input.messageType);
        const totalCostUSD = discountedRate * input.volume;

        // Taxa de câmbio (exemplo fixo, pode ser dinâmico)
        const exchangeRate = 5.35;

        let totalCost: number;
        let costPerMessage: number;
        let exchangeRateStr: string | undefined;

        if (input.currency === "BRL") {
          totalCost = totalCostUSD * exchangeRate;
          costPerMessage = discountedRate * exchangeRate;
          exchangeRateStr = exchangeRate.toFixed(2);
        } else {
          totalCost = totalCostUSD;
          costPerMessage = discountedRate;
        }

        return {
          totalCost: totalCost.toFixed(2),
          costPerMessage: costPerMessage.toFixed(4),
          volume: input.volume,
          currency: input.currency,
          exchangeRate: exchangeRateStr,
        };
      }),

    saveCalculation: protectedProcedure
      .input(z.object({
        country: z.string(),
        volume: z.number().int().positive(),
        messageType: z.enum(["marketing", "utility", "authentication"]),
        currency: z.enum(["USD", "BRL"]),
        totalCost: z.string(),
        costPerMessage: z.string(),
        exchangeRate: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { saveCalculation } = await import("./db");
        await saveCalculation({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    myCalculations: protectedProcedure
      .query(async ({ ctx }) => {
        const { getUserCalculations } = await import("./db");
        return await getUserCalculations(ctx.user.id);
      }),
  }),

  // Rotas de leads
  leads: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        surname: z.string().optional(),
        phone: z.string().min(1),
        email: z.string().email(),
        company: z.string().min(1),
        country: z.string().optional(),
        volume: z.number().int().positive().optional(),
        messageType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { saveLead } = await import("./db");
        await saveLead(input);
        return { success: true };
      }),

    list: protectedProcedure
      .query(async () => {
        const { getAllLeads } = await import("./db");
        return await getAllLeads();
      }),
  }),

  // Rotas de taxas de países
  rates: router({
    getCountry: publicProcedure
      .input(z.object({ country: z.string() }))
      .query(async ({ input }) => {
        const { getCountryRate } = await import("./db");
        return await getCountryRate(input.country);
      }),

    listAll: publicProcedure
      .query(async () => {
        const { getAllCountryRates } = await import("./db");
        return await getAllCountryRates();
      }),
  }),
});

export type AppRouter = typeof appRouter;
