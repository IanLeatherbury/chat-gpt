import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChatBubbleLeftIcon, Bars3BottomLeftIcon, MoonIcon, SunIcon } from '@heroicons/react/20/solid';
import useDarkMode from '../hooks/useDarkMode';

// Load pages with dynamic imports
const ChatPage = dynamic(() => import('../pages/chat'));

// Initial navigation items
const initialNavigation = [
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftIcon, current: false },
];

// Utility function to concatenate class names
function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

// Home component
export default function Home() {
  const isDarkMode = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>("Chat");
  const [navigation, setNavigation] = useState(initialNavigation);
  const [darkMode, setDarkMode] = useState(isDarkMode);

  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);

  // Handle navigation click
  const handleClick = (name: string) => {
    setSelectedPage(name);
    setNavigation(
      navigation.map((item) =>
        item.name === name ? { ...item, current: true } : { ...item, current: false }
      )
    );
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Update body class based on dark mode state
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Return the Home component JSX
  return (
    <>
      <div className={darkMode ? 'dark' : ''}>
        <div className="bg-white dark:bg-gray-700">
          {/* Sidebar */}
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75" />
              </Transition.Child>

              {/* Mobile sidebar */}
              <div className="fixed inset-0 z-40 flex ">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white dark:bg-gray-800">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 right-0 pt-2 -mr-12 ">
                        <button
                          type="button"
                          className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:focus:ring-gray-500"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon className="w-6 h-6 text-white dark:text-gray-300" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex items-center flex-shrink-0 px-4">
                      <Image
                        className="rounded-full"
                        src="https://i.imgur.com/KNKPDcW.png"
                        alt="Ian Leatherbury"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="flex-1 h-0 mt-5 overflow-y-auto">
                      <nav className="px-2 space-y-1">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            onClick={() => {
                              handleClick(item.name)
                            }}
                            className={classNames(
                              item.current ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-100',
                              'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer'
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300',
                                'mr-3 h-6 w-6 flex-shrink-0'
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
                <div className="flex-shrink-0 w-14" aria-hidden="true">
                  {/* Dummy element to force sidebar to shrink to fit close icon */}
                </div>
              </div>

            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
            {/* Sidebar component */}
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center flex-shrink-0 px-4">
                <Image
                  className="rounded-full"
                  src="https://i.imgur.com/KNKPDcW.png"
                  alt="Ian Leatherbury"
                  width={64}
                  height={64}
                />
              </div>

              <div className="flex flex-col flex-grow mt-5">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      onClick={() => {
                        handleClick(item.name)
                      }}
                      className={classNames(
                        item.current ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-200',
                        'group flex items-center rounded-md px-2 py-2 text-sm font-medium cursor-pointer'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400',
                          'mr-3 h-6 w-6 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col flex-1 lg:pl-64">
            <div className="sticky top-0 flex flex-shrink-0 h-10 bg-white dark:bg-gray-800 lg:hidden">
              <button
                type="button"
                className="px-4 text-gray-500 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3BottomLeftIcon className="w-6 h-6" aria-hidden="true" />
              </button>

              {/* Top bar */}
              <div className="flex items-center justify-center flex-1 text-lg text-gray-900 border-b border-gray-200 dark:text-gray-200 dark:border-gray-700 lg:hidden">
                {selectedPage}
              </div>

              <div className='w-16 border-b border-gray-200 dark:border-gray-700'></div>
            </div>

            {/* Page content */}
            <main className="flex-1">
              <div className="flex flex-col min-h-screen py-6">
                <div className="flex-1 w-full px-4 mx-auto sm:px-6 lg:px-8">
                  {selectedPage === 'Chat' && <ChatPage />}
                </div>
              </div>
            </main>
          </div>
        </div>


        {/* Dark mode toggle */}
        <button
          className="fixed p-2 text-white bg-gray-800 rounded-full bottom-4 left-4 dark:bg-gray-200 dark:text-gray-800 focus:outline-none"
          onClick={toggleDarkMode}
        >
          {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
      </div>
    </>
  )
}