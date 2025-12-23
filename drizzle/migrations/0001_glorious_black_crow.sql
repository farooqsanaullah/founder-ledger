CREATE TABLE "investments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"startup_id" uuid NOT NULL,
	"round_name" varchar(100) NOT NULL,
	"investor_name" varchar(255) NOT NULL,
	"type" "investment_type" NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"converted_amount" numeric(15, 2),
	"exchange_rate" numeric(10, 6),
	"equity_percentage" numeric(5, 2),
	"premoney_valuation" numeric(15, 2),
	"postmoney_valuation" numeric(15, 2),
	"investment_date" date NOT NULL,
	"board_seat" boolean DEFAULT false,
	"lead_investor" boolean DEFAULT false,
	"preference_multiple" numeric(3, 1) DEFAULT '1.0',
	"participation_rights" boolean DEFAULT false,
	"anti_dilution_rights" varchar(50),
	"notes" text,
	"document_url" text,
	"created_by_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investments" ADD CONSTRAINT "investments_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;