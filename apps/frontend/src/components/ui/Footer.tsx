import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faTiktok,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg" />
              <span className="text-xl font-bold text-white">DeepPeru</span>
            </div>
            <p className="text-sm text-gray-400">
              Vive experiencias únicas en Perú con paquetes diseñados para cada
              tipo de viajero.
            </p>
          </div>

          {/* DeepPeru */}
          <div>
            <h4 className="text-white font-semibold mb-4">DeepPeru</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="hover:text-white transition-colors"
                >
                  Work with us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Service terms
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-4">Destinations</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/destinations/cusco"
                  className="hover:text-white transition-colors"
                >
                  Cusco
                </a>
              </li>
              <li>
                <a
                  href="/destinations/lima"
                  className="hover:text-white transition-colors"
                >
                  Lima
                </a>
              </li>
              <li>
                <a
                  href="/destinations/arequipa"
                  className="hover:text-white transition-colors"
                >
                  Arequipa
                </a>
              </li>
              <li>
                <a
                  href="/destinations/puno"
                  className="hover:text-white transition-colors"
                >
                  Puno
                </a>
              </li>
              <li>
                <a
                  href="/destinations/iquitos"
                  className="hover:text-white transition-colors"
                >
                  Iquitos
                </a>
              </li>
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow us</h4>
            <div className="flex items-center gap-4">
              <a
                aria-label="Facebook"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                aria-label="Instagram"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                aria-label="Twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                aria-label="YouTube"
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a
                aria-label="TikTok"
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {year} DeepPeru. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="/terms" className="hover:text-white transition-colors">
              Términos
            </a>
            <span className="opacity-40">•</span>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </a>
            <span className="opacity-40">•</span>
            <a href="/cookies" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
