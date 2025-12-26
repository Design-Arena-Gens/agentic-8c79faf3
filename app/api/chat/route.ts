import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const knowledgeBase = {
  greetings: ['hello', 'hi', 'hey', 'greetings'],
  shipping: ['ship', 'shipping', 'delivery', 'tracking', 'track order'],
  returns: ['return', 'refund', 'exchange', 'money back'],
  account: ['account', 'login', 'password', 'sign in', 'register'],
  payment: ['payment', 'credit card', 'pay', 'billing', 'charge'],
  product: ['product', 'item', 'availability', 'stock', 'in stock'],
  support: ['help', 'support', 'assistance', 'contact', 'talk to human'],
}

function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (knowledgeBase.shipping.some(keyword => lowerMessage.includes(keyword))) {
    return 'shipping'
  }
  if (knowledgeBase.returns.some(keyword => lowerMessage.includes(keyword))) {
    return 'returns'
  }
  if (knowledgeBase.account.some(keyword => lowerMessage.includes(keyword))) {
    return 'account'
  }
  if (knowledgeBase.payment.some(keyword => lowerMessage.includes(keyword))) {
    return 'payment'
  }
  if (knowledgeBase.product.some(keyword => lowerMessage.includes(keyword))) {
    return 'product'
  }
  if (knowledgeBase.support.some(keyword => lowerMessage.includes(keyword))) {
    return 'support'
  }

  return 'general'
}

function generateResponse(intent: string, message: string): string {
  const responses = {
    shipping: `I can help you with shipping information! Our standard shipping takes 3-5 business days, and express shipping takes 1-2 business days.

To track your order, you can:
1. Check your email for the tracking number
2. Log into your account and view order history
3. Use the tracking number on our shipping partner's website

Is there a specific order you'd like to track?`,

    returns: `I understand you're interested in our return policy. Here's what you need to know:

• You can return items within 30 days of delivery
• Items must be in original condition with tags attached
• Refunds are processed within 5-7 business days
• To start a return, visit your account dashboard or reply with your order number

Would you like me to help you initiate a return?`,

    account: `I can help you with account-related issues! Here are common solutions:

• **Forgot password?** Click "Forgot Password" on the login page
• **Can't login?** Make sure you're using the correct email address
• **New account?** Click "Sign Up" and follow the registration process
• **Update account info?** Log in and go to Account Settings

What specific account issue are you experiencing?`,

    payment: `I'm here to help with payment questions! Here's what you should know:

• We accept all major credit cards, PayPal, and Apple Pay
• Payments are processed securely through encrypted channels
• You'll receive a receipt via email after each purchase
• For billing issues, check your account's payment history

Is there a specific payment issue I can help you resolve?`,

    product: `I'd be happy to help you with product information!

For product availability and details:
• Check the product page for stock status
• Most items restock within 1-2 weeks
• You can set up stock alerts for out-of-stock items
• Product specifications are listed on each product page

What product are you interested in learning more about?`,

    support: `I'm here to provide support! I can help you with:

✓ Order tracking and shipping
✓ Returns and refunds
✓ Account management
✓ Payment issues
✓ Product information
✓ General inquiries

If you need to speak with a human agent, I can transfer you. Our support team is available:
• Monday-Friday: 9 AM - 8 PM EST
• Saturday-Sunday: 10 AM - 6 PM EST

What can I help you with today?`,

    general: `Thank you for reaching out! I'm here to assist you with any questions or concerns.

I can help you with:
• Shipping and delivery questions
• Returns and refunds
• Account management
• Payment and billing
• Product information
• General support

Please let me know what you need help with, and I'll do my best to assist you!`
  }

  return responses[intent as keyof typeof responses] || responses.general
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      )
    }

    // Detect intent and generate response
    const intent = detectIntent(message)
    const response = generateResponse(intent, message)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
