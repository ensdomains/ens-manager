import React from 'react'

export default () =>
  <div className="about-page">
    <h2>About the ENS Manager</h2>
    <p>The ENS Manager was built by <a href="http://twitter.com/_jefflau">Jeff Lau</a> and commissioned by the creator of the ENS <a href="http://twitter.com/arachnid">Nick Johnson</a> via <a href="https://ethlance.com/#/job/97">Ethlance</a>. The code is open source on <a href="https://github.com/jefflau/ens-manager">github</a> and welcomes contributions. The role of the ENS manager is to help non-technicals manage their domains and create subdomains that they have bought via the <a href="https://registrar.ens.domains/">ENS registrar</a>. You can add a resolver, add an address for your name to resolve to, as well as add subdomains that can also have their own addresses</p>
    <h3>Using the manager</h3>
    <p>
      If you haven't already you need to purchase a domain at <a href="https://registrar.ens.domains/">registrar.ens.domains</a>. The owner of the domain must be available in Metamask or Mist. From there you can search your own domain and then use the app to send transactions to  to edit the domains owner, add subdomains or resolve your name to an address. To set an address you must first set a resolver. The default public resolver will be enough for normal usage. Once you set the resolver you can add an address (such as your ETH address) for your name to resolve to.
    </p>
    <h3>Setting a Reverse record</h3>
    <p>
      The reverse record sets the .eth name that a particular Ethereum address is associated. This can be used by other dapp applications to replace that address in their user interface with your human readable .eth name
    </p>
  </div>
