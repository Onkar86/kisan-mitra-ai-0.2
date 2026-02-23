
import React from 'react';

const naturalFormulas = [
  {
    title: 'Jeevamrut (Soil Booster)',
    ingredients: 'Cow dung, Cow urine, Jaggery, Pulse flour, Soil from the same field.',
    utility: 'Enhances microbial activity and improves soil fertility exponentially.',
    icon: '🔋'
  },
  {
    title: 'Neem-Astra (Pest Repellent)',
    ingredients: 'Neem leaves, Cow urine, Cow dung.',
    utility: 'Controls sucking pests and mealy bugs naturally without harmful residue.',
    icon: '🛡️'
  },
  {
    title: 'Brahma-Astra (Deep Pest Control)',
    ingredients: 'Neem, Custard apple, Papaya, Pomegranate, Guava leaves boiled in cow urine.',
    utility: 'Effective against large caterpillars and borers.',
    icon: '⚡'
  },
  {
    title: 'Agni-Astra',
    ingredients: 'Cow urine, Tobacco, Green chili, Garlic, Neem.',
    utility: 'Powerful repellent for extreme pest infestations.',
    icon: '🔥'
  }
];

const RajivWisdom: React.FC = () => {
  return (
    <div className="space-y-12 pb-20 animate-fadeIn">
      <header className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold text-stone-800 mb-4 tracking-tight">Vedic Krishi Wisdom</h2>
        <div className="h-1 w-20 bg-lime-500 mx-auto mb-6"></div>
        <p className="text-stone-600 text-lg">
          Explore the profound agricultural principles championed by <span className="font-bold text-stone-800">Shri Rajiv Dixit</span>. 
          Focusing on Swadeshi, sustainable, and Zero-Budget Natural Farming.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-200">
          <h3 className="text-2xl font-bold text-stone-800 mb-6">Fundamental Pillars</h3>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-lime-100 rounded-2xl flex items-center justify-center font-bold text-green-700">1</span>
              <div>
                <h4 className="font-bold text-stone-800">Beejamrut (Seed Treatment)</h4>
                <p className="text-sm text-stone-500 mt-1">Treating seeds with local microbial cultures to prevent soil-borne diseases.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-lime-100 rounded-2xl flex items-center justify-center font-bold text-green-700">2</span>
              <div>
                <h4 className="font-bold text-stone-800">Jeevamrut (Microbial Enrichment)</h4>
                <p className="text-sm text-stone-500 mt-1">Applying fermented cultures of local bacteria to multiply soil life.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-lime-100 rounded-2xl flex items-center justify-center font-bold text-green-700">3</span>
              <div>
                <h4 className="font-bold text-stone-800">Mulching (Acchaadana)</h4>
                <p className="text-sm text-stone-500 mt-1">Covering soil with biomass to preserve moisture and prevent erosion.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-lime-100 rounded-2xl flex items-center justify-center font-bold text-green-700">4</span>
              <div>
                <h4 className="font-bold text-stone-800">Moisture (Whapasa)</h4>
                <p className="text-sm text-stone-500 mt-1">Understanding that roots need air as much as water.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-green-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl"></div>
          <h3 className="text-2xl font-bold mb-6">Rajiv Dixit's Philosophy</h3>
          <blockquote className="text-lg italic text-lime-100 border-l-4 border-lime-400 pl-6 space-y-4">
            <p>"Chemical fertilizers are not food for the soil; they are like poison for the earth."</p>
            <p>"A farmer's true wealth is the health of his soil and the purity of his seeds."</p>
            <p>"Swadeshi farming means using what you have in your cowshed, not what is sold in expensive markets."</p>
          </blockquote>
          <div className="mt-8 pt-8 border-t border-green-800">
            <p className="text-sm text-green-300">
              By following these natural methods, farmers can eliminate input costs entirely, leading to 
              <span className="font-bold text-white"> Zero Budget Natural Farming (ZBNF)</span>.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-stone-800 mb-8 px-4">Essential Natural Formulas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {naturalFormulas.map((formula) => (
            <div key={formula.title} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">{formula.icon}</div>
              <h4 className="font-bold text-stone-800 mb-2">{formula.title}</h4>
              <p className="text-xs text-stone-400 font-bold uppercase mb-3">Ingredients</p>
              <p className="text-xs text-stone-600 mb-4">{formula.ingredients}</p>
              <div className="pt-4 border-t border-stone-50">
                <p className="text-xs text-green-600 font-medium">{formula.utility}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-stone-200/50 p-8 rounded-[2.5rem] text-center">
        <p className="text-stone-500 font-medium">Protect the Earth, Feed the Nation, Save the Future.</p>
        <button className="mt-4 px-8 py-3 bg-stone-800 text-white rounded-full font-bold text-sm hover:bg-stone-900 transition-colors shadow-lg">
          Download PDF Guide
        </button>
      </footer>
    </div>
  );
};

export default RajivWisdom;
