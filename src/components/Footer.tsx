import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-950 border-t border-red-200 dark:border-red-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent mb-4">
              Shuriken
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              The precision CLI tool manager that brings the art of dependency
              injection to command-line development. Swift, silent, and deadly
              effective.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 hover:scale-110 transform"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">
              Documentation
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  Getting Started
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  Examples
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  Contribute
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-red-200 dark:border-red-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 Shuriken CLI. Open source with MIT license.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
