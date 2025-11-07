import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, MessageSquare, TrendingDown, Phone } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Currency = "USD" | "BRL";
type MessageType = "marketing" | "utility" | "authentication";

// Variantes de animação
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

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
    { range: "0 - 250.000", discount: "0%", rate: "Taxa base" },
    { range: "250.001 - 2.000.000", discount: "-5%", rate: "Taxa × 0,95" },
    { range: "2.000.001 - 17.000.000", discount: "-10%", rate: "Taxa × 0,90" },
    { range: "17.000.001 - 35.000.000", discount: "-15%", rate: "Taxa × 0,85" },
    { range: "35.000.001 - 70.000.000", discount: "-20%", rate: "Taxa × 0,80" },
    { range: "70.000.001+", discount: "-25%", rate: "Taxa × 0,75" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <motion.section 
        className="container py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Calculator className="w-16 h-16 text-[#25D366] mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Calculadora de Custos
              <span className="block text-[#25D366]">WhatsApp Business API</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Calcule o custo estimado das suas mensagens no WhatsApp Business Platform
            com taxas oficiais atualizadas para 2025
          </motion.p>
        </div>
      </motion.section>

      {/* Calculator Section */}
      <section className="container py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg border-2 border-green-100 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#25D366]" />
                  Configure sua Mensagem
                </CardTitle>
                <CardDescription>
                  Ajuste os parâmetros para calcular o custo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currency Selector */}
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="currency">Moeda</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["USD", "BRL"] as Currency[]).map((curr) => (
                      <Button
                        key={curr}
                        variant={currency === curr ? "default" : "outline"}
                        onClick={() => setCurrency(curr)}
                        className={`transition-all duration-300 ${
                          currency === curr 
                            ? "bg-[#25D366] hover:bg-[#20BD5A] scale-105" 
                            : "hover:border-[#25D366]"
                        }`}
                      >
                        {curr === "USD" ? "🇺🇸 USD" : "🇧🇷 BRL"}
                      </Button>
                    ))}
                  </div>
                </motion.div>

                {/* Volume Input */}
                <motion.div 
                  className="space-y-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Label htmlFor="volume">Volume de Mensagens</Label>
                  <Input
                    id="volume"
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="text-lg font-semibold border-2 focus:border-[#25D366] transition-colors duration-300"
                    min="1"
                  />
                  <p className="text-sm text-gray-500">
                    {volume.toLocaleString("pt-BR")} mensagens/mês
                  </p>
                </motion.div>

                {/* Message Type Selector */}
                <div className="space-y-3">
                  <Label>Tipo de Mensagem</Label>
                  <div className="grid gap-3">
                    {messageTypes.map((type, index) => (
                      <motion.button
                        key={type.type}
                        onClick={() => setMessageType(type.type)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                          messageType === type.type ? type.activeColor : type.color
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-semibold">{type.title}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Results */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInRight}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg border-2 border-green-100 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#25D366]" />
                  Resultado do Cálculo
                </CardTitle>
                <CardDescription>
                  Custo estimado baseado nas taxas oficiais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {calculateMutation.isPending ? (
                  <motion.div 
                    className="flex items-center justify-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Calculator className="w-12 h-12 text-[#25D366]" />
                    </motion.div>
                  </motion.div>
                ) : result ? (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="bg-gradient-to-br from-[#25D366] to-[#20BD5A] rounded-xl p-6 text-white"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-sm opacity-90 mb-2">Custo Total</div>
                      <motion.div 
                        className="text-4xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        {currency === "BRL" ? "R$" : "$"} {result.totalCost}
                      </motion.div>
                      <div className="text-sm opacity-90 mt-2">
                        {result.volume.toLocaleString("pt-BR")} mensagens
                      </div>
                    </motion.div>

                    <motion.div 
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.div 
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        whileHover={{ scale: 1.05, borderColor: "#25D366" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-xs text-gray-600 mb-1">Custo por Mensagem</div>
                        <div className="text-xl font-bold text-gray-900">
                          {currency === "BRL" ? "R$" : "$"} {result.costPerMessage}
                        </div>
                      </motion.div>

                      <motion.div 
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        whileHover={{ scale: 1.05, borderColor: "#25D366" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-xs text-gray-600 mb-1">Tipo</div>
                        <div className="text-lg font-semibold text-gray-900 capitalize">
                          {messageType === "utility" ? "Utilidade" : 
                           messageType === "authentication" ? "Autenticação" : "Marketing"}
                        </div>
                      </motion.div>
                    </motion.div>

                    {result.exchangeRate && (
                      <motion.div 
                        className="text-sm text-gray-600 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        Taxa de câmbio: 1 USD = R$ {result.exchangeRate}
                      </motion.div>
                    )}
                  </motion.div>
                ) : null}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-6 text-lg transition-all duration-300"
                    size="lg"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {showContactForm ? "Ocultar Formulário" : "Solicitar Contato"}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      {showContactForm && (
        <motion.section 
          className="container py-12"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-2xl mx-auto shadow-lg border-2 border-green-100">
              <CardHeader>
                <CardTitle>Solicite um Contato</CardTitle>
                <CardDescription>
                  Preencha o formulário e nossa equipe entrará em contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div 
                      className="space-y-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border-2 focus:border-[#25D366] transition-colors duration-300"
                      />
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Label htmlFor="surname">Sobrenome</Label>
                      <Input
                        id="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="border-2 focus:border-[#25D366] transition-colors duration-300"
                      />
                    </motion.div>
                  </div>

                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      required
                      className="border-2 focus:border-[#25D366] transition-colors duration-300"
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-2 focus:border-[#25D366] transition-colors duration-300"
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Label htmlFor="company">Empresa *</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className="border-2 focus:border-[#25D366] transition-colors duration-300"
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-6 text-lg transition-all duration-300"
                      disabled={submitLeadMutation.isPending}
                    >
                      {submitLeadMutation.isPending ? "Enviando..." : "Enviar Solicitação"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      )}

      {/* Volume Tiers Section */}
      <motion.section 
        className="container py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <motion.div
            variants={scaleIn}
            transition={{ duration: 0.6 }}
          >
            <TrendingDown className="w-12 h-12 text-[#25D366] mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Descontos Progressivos por Volume
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quanto mais mensagens você enviar, menor será o custo por mensagem.
              Descontos aplicáveis apenas para mensagens de Utilidade e Autenticação.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {volumeTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-2 border-green-100 hover:border-[#25D366] hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{tier.range}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#25D366] mb-2">
                    {tier.discount}
                  </div>
                  <div className="text-sm text-gray-600">{tier.rate}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Info Section */}
      <motion.section 
        className="bg-green-50 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.h2 
              className="text-3xl font-bold text-gray-900"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              Sobre os Tipos de Mensagem
            </motion.h2>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mt-8"
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {messageTypes.map((type, index) => (
                <motion.div
                  key={type.type}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <Card className={`${type.color} border-2 hover:shadow-lg transition-all duration-300`}>
                    <CardHeader>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{type.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="mt-8 p-6 bg-white rounded-lg shadow-md"
              variants={scaleIn}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm text-gray-600">
                <strong className="text-[#25D366]">Importante:</strong> Mensagens de Utilidade 
                enviadas dentro da janela de atendimento de 24 horas são <strong>gratuitas</strong>. 
                Mensagens de Serviço (não-template) são sempre gratuitas dentro da janela de atendimento.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-white py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container text-center">
          <motion.p 
            className="text-sm text-gray-400"
            whileHover={{ scale: 1.05 }}
          >
            © 2025 CostFlow Calculator. Taxas baseadas na documentação oficial do WhatsApp Business Platform.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}
