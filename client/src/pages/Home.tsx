import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, MessageSquare, TrendingDown, Phone } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Currency = "USD" | "BRL";
type MessageType = "marketing" | "utility" | "authentication";

export default function Home() {
  const [currency, setCurrency] = useState<Currency>("BRL");
  const [country] = useState("Brasil");
  const [volume, setVolume] = useState(10000);
  const [messageType, setMessageType] = useState<MessageType>("utility");
  const [showContactForm, setShowContactForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhoneInput] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const calculateMutation = trpc.calculator.calculate.useMutation();
  const submitLeadMutation = trpc.leads.submit.useMutation();

  // Calcular automaticamente quando inputs mudam
  const calculationInput = useMemo(() => ({
    country,
    volume,
    messageType,
    currency,
  }), [country, volume, messageType, currency]);

  // Executar cálculo automaticamente
  useMemo(() => {
    if (volume > 0) {
      calculateMutation.mutate(calculationInput);
    }
  }, [calculationInput]);

  const result = calculateMutation.data;

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitLeadMutation.mutateAsync({
        name,
        surname,
        phone: phone,
        email,
        company,
        country,
        volume,
        messageType,
      });
      
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setShowContactForm(false);
      // Limpar form
      setName("");
      setSurname("");
      setPhoneInput("");
      setEmail("");
      setCompany("");
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }
  };

  const messageTypes = [
    {
      type: "marketing" as MessageType,
      title: "Marketing",
      description: "Mensagens promocionais e campanhas",
      color: "border-red-200 bg-red-50 hover:bg-red-100",
      activeColor: "border-red-500 bg-red-100",
    },
    {
      type: "utility" as MessageType,
      title: "Utilidade",
      description: "Notificações de pedidos, alertas, atualizações",
      color: "border-green-200 bg-green-50 hover:bg-green-100",
      activeColor: "border-green-500 bg-green-100",
    },
    {
      type: "authentication" as MessageType,
      title: "Autenticação",
      description: "Códigos OTP, verificações de segurança",
      color: "border-orange-200 bg-orange-50 hover:bg-orange-100",
      activeColor: "border-orange-500 bg-orange-100",
    },
  ];

  const volumeTiers = [
    { range: "0 - 250.000", discount: "0%", rate: "US$ 0,0068/msg" },
    { range: "250.001 - 2.000.000", discount: "-5%", rate: "US$ 0,0065/msg" },
    { range: "2.000.001 - 17.000.000", discount: "-10%", rate: "US$ 0,0061/msg" },
    { range: "17.000.001 - 35.000.000", discount: "-15%", rate: "US$ 0,0058/msg" },
    { range: "35.000.001 - 70.000.000", discount: "-20%", rate: "US$ 0,0054/msg" },
    { range: "70.000.001 - ∞", discount: "-25%", rate: "US$ 0,0051/msg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">CostFlow</h1>
          </div>
          <a href="tel:+551148634209" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">(11) 4863-4209</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Calcule o Custo Real da{" "}
            <span className="text-primary">API Oficial do WhatsApp</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubra em segundos quanto sua empresa vai investir por mensagem e como otimizar seus custos com templates validados.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calcular Agora
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-primary">3</div>
              <p className="text-sm text-muted-foreground mt-2">Tipos de Mensagem</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-primary">25%</div>
              <p className="text-sm text-muted-foreground mt-2">Desconto Máximo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-primary">6</div>
              <p className="text-sm text-muted-foreground mt-2">Níveis de Volume</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Exchange Rate Banner */}
      <div className="bg-primary/10 border-y border-primary/20">
        <div className="container py-3 text-center">
          <p className="text-sm font-medium">
            Taxa de câmbio atualizada: 1 USD = 5,35 BRL
          </p>
        </div>
      </div>

      {/* Calculator Section */}
      <section id="calculator" className="container py-12 md:py-20">
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Calculadora de Custos</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para estimar o custo total de envio de mensagens usando a API oficial.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Currency Selector */}
            <div className="flex gap-2">
              <Button
                variant={currency === "USD" ? "default" : "outline"}
                onClick={() => setCurrency("USD")}
                className="flex-1"
              >
                USD ($)
              </Button>
              <Button
                variant={currency === "BRL" ? "default" : "outline"}
                onClick={() => setCurrency("BRL")}
                className="flex-1"
              >
                BRL (R$)
              </Button>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label>País</Label>
              <Input value={country} disabled className="bg-muted" />
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <Label htmlFor="volume">Volume de Mensagens (por mês)</Label>
              <Input
                id="volume"
                type="number"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value) || 0)}
                min="0"
                step="1000"
              />
            </div>

            {/* Message Type */}
            <div className="space-y-3">
              <Label>Tipo de Mensagem</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {messageTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setMessageType(type.type)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      messageType === type.type ? type.activeColor : type.color
                    }`}
                  >
                    <div className="font-semibold">{type.title}</div>
                    {messageType === type.type && (
                      <div className="text-xs font-medium text-primary mt-1">Selecionado</div>
                    )}
                    <div className="text-sm text-muted-foreground mt-2">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <DollarSign className="h-4 w-4" />
                      Custo Total
                    </div>
                    <div className="text-3xl font-bold text-green-700">
                      {currency === "USD" ? "US$" : "R$"} {result.totalCost}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Taxa: {currency === "USD" ? "US$" : "R$"} {result.costPerMessage}/msg
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MessageSquare className="h-4 w-4" />
                      Volume
                    </div>
                    <div className="text-3xl font-bold text-blue-700">
                      {result.volume.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">mensagens/mês</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Info Sections */}
      <section className="container py-12 md:py-20 space-y-12">
        {/* Message Types Info */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Entenda os Tipos de Mensagem</h3>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mensagens promocionais, ofertas, campanhas publicitárias e conteúdo que visa vender produtos ou serviços. 
                  Têm custo mais alto e não possuem descontos por volume.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Utilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notificações transacionais como confirmações de pedido, atualizações de entrega, alertas de conta e lembretes. 
                  São gratuitas dentro da janela de 24h e têm descontos progressivos por volume.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Autenticação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Códigos de verificação (OTP), confirmações de login e validações de segurança. 
                  Possuem o menor custo e também têm descontos por volume.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Volume Tiers */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-primary" />
            Níveis de Volume (Volume Tiers)
          </h3>
          <div className="space-y-2">
            {volumeTiers.map((tier, index) => (
              <Card key={index} className={index === 0 ? "border-primary bg-primary/5" : ""}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{tier.range}</span>
                    {tier.discount !== "0%" && (
                      <span className="text-sm text-primary font-semibold">{tier.discount}</span>
                    )}
                  </div>
                  <span className="font-mono text-sm">{tier.rate}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <p className="text-sm">
                <strong>Importante:</strong> Mensagens não-template (texto, imagem, etc.) são{" "}
                <span className="text-primary font-semibold">GRATUITAS</span> dentro da janela de atendimento (24h).
              </p>
              <p className="text-sm mt-2">
                Mensagens de utilidade enviadas dentro da janela de atendimento também são{" "}
                <span className="text-primary font-semibold">GRATUITAS</span>.
              </p>
              <p className="text-sm mt-2">
                Os descontos por volume são aplicados automaticamente conforme seu volume mensal de mensagens de utilidade e autenticação.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold">
            Quer que nossa equipe implemente a API Oficial para sua empresa?
          </h3>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Criamos todos os templates prontos e validados de utilidade para reduzir seus custos e aumentar sua eficiência operacional.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8"
            onClick={() => setShowContactForm(true)}
          >
            Falar com Especialista
          </Button>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Entre em Contato</CardTitle>
              <CardDescription>
                Preencha o formulário e entraremos em contato em breve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitLead} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surname">Sobrenome</Label>
                  <Input
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa *</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitLeadMutation.isPending}
                    className="flex-1"
                  >
                    {submitLeadMutation.isPending ? "Enviando..." : "Enviar mensagem"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 CostFlow Calculator - Calculadora API WhatsApp</p>
          <p className="mt-2">Desenvolvido para otimizar seus custos com WhatsApp Business API</p>
        </div>
      </footer>
    </div>
  );
}
