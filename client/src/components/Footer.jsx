import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-kagc-purple-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-kagc-gold-400">
              Karen AGC
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Built on a Firm Foundation. Join us in worship and community as we grow together in faith.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-kagc-gold-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://karenagc.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-kagc-gold-400 transition-colors flex items-center gap-2"
                >
                  Main Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://giving.karenagc.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-kagc-gold-400 transition-colors flex items-center gap-2"
                >
                  Give
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://karenagc.org/ministries" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-kagc-gold-400 transition-colors flex items-center gap-2"
                >
                  Ministries
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://karenagc.org/about" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-kagc-gold-400 transition-colors flex items-center gap-2"
                >
                  About Us
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-kagc-gold-400">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-kagc-gold-400 mt-0.5 flex-shrink-0" />
                <a 
                  href="mailto:pastor@karenagc.org" 
                  className="text-gray-300 hover:text-kagc-gold-400 transition-colors"
                >
                  pastor@karenagc.org
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-kagc-gold-400 mt-0.5 flex-shrink-0" />
                <a 
                  href="tel:+254724334333" 
                  className="text-gray-300 hover:text-kagc-gold-400 transition-colors"
                >
                  +254 724 334 333
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-kagc-gold-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  974-00502 Langata, Nairobi
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Service Times */}
        <div className="border-t border-kagc-purple-700 pt-8 mb-8">
          <h3 className="text-xl font-heading font-bold mb-4 text-kagc-gold-400 text-center">
            Service Times
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-semibold text-white">Sunday Worship</p>
              <p className="text-gray-300">10:00 AM</p>
            </div>
            <div>
              <p className="font-semibold text-white">Midweek Service</p>
              <p className="text-gray-300">Wednesday 6:00 PM</p>
            </div>
            <div>
              <p className="font-semibold text-white">Children's Service</p>
              <p className="text-gray-300">Sunday 10:00 AM</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-kagc-purple-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Karen Africa Gospel Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
