<template>
  <Banner />
  <v-main>
    <v-container fluid class="pa-0">
      <v-sheet class="py-8 py-md-12" style="background: rgb(var(--v-theme-preto));">
        <v-row justify="center">
          <v-col cols="12" md="11" lg="10" class="px-4">
            
            <v-btn 
              variant="text" 
              prepend-icon="mdi-arrow-left" 
              class="fonte text-capitalize mb-6 text-body-2" 
              @click="voltar"
              style="color: rgb(var(--v-theme-septenary));"
            >
              Voltar para o início
            </v-btn>

            <v-card elevation="2" class="rounded-xl pa-6 pa-sm-10 pa-md-14" color="#FFFDF9">
              <div class="d-flex flex-column gap-6 text-justify">
                
                <div class="d-flex flex-column gap-2 text-center text-sm-left">
                  <h1 class="fonte text-h4 text-md-h3 font-weight-bold text-black leading-tight">
                    Termos de Uso e Serviço do Entre Ideias
                  </h1>
                </div>

                <div class="fonte text-body-large text-grey-darken-3">
                  Seja Bem-Vindo ao blog Entre Ideias. Antes de explorar tudo o que temos a oferecer, é importante que você entenda e concorde com algumas regras básicas que regem o uso do nosso blog entreideias.com.br, e qualquer outro serviço digital que nós oferecemos, como lojas e plataformas de e-commerce.
                </div>

                <div class="fonte text-body-large text-grey-darken-3">
                  Ao usar nosso blog e serviços, você automaticamente concorda em seguir as regras que estabelecemos aqui. Caso não concorde com algo, por favor, considere não usar nossos serviços. É muito importante para nós que você se sinta seguro e informado a todo momento.
                </div>

                <div class="d-flex flex-column gap-6 mt-4">
                  
                  <div class="section-block">
                    <h2 class="fonte text-h6 font-weight-semibold text-black mb-3">1. Aceitando os Termos</h2>
                    <div class="fonte text-body-large text-grey-darken-3">
                      Ao navegar e usar o blog do Entre Ideias, você concorda automaticamente com nossas regras e condições. Estamos sempre procurando melhorar, então esses termos podem mudar de vez em quando. Se fizermos alterações significativas, vamos postar as atualizações aqui no blog. Continuar usando o blog após essas mudanças significa que você aceita os novos termos.
                    </div>
                  </div>

                  <div class="section-block">
                    <h2 class="fonte text-h6 font-weight-semibold text-black mb-3">2. Como Usar o Nosso Blog</h2>
                    <div class="fonte text-body-large text-grey-darken-3">
                      A maior parte do nosso blog está aberta para você sem a necessidade de cadastro. No entanto, algumas seções especiais podem exigir que você crie uma conta. Pedimos que você seja honesto ao fornecer suas informações e que mantenha sua senha e login seguros. Se decidir compartilhar algum conteúdo conosco, como comentários, por favor, faça-o de maneira respeitosa e dentro da lei.
                    </div>
                  </div>

                  <div class="section-block">
                    <h2 class="fonte text-h6 font-weight-semibold text-black mb-3">3. Sua Privacidade</h2>
                    <div class="fonte text-body-large text-grey-darken-3 mb-3">
                      No Entre Ideias, a privacidade é um value essencial. Ao interagir com nosso blog, você aceita nossa Política de Privacidade, que detalha nossa abordagem responsável e conforme às leis para o manejo dos seus dados pessoais. Nosso compromisso é com a transparência e a segurança: explicamos como coletamos, usamos e protegemos suas informações, garantindo sua privacidade e oferecendo controle sobre seus dados.
                    </div>
                    <div class="fonte text-body-large text-grey-darken-3">
                      Adotamos práticas de segurança para proteger suas informações contra acesso não autorizado e compartilhamento indevido, assegurando que qualquer cooperação com terceiros ocorra apenas com base na sua aprovação ou exigências legais claras, reafirmando nosso comprometimento com a sua confiança e segurança digital.
                    </div>
                  </div>

                  <div class="section-block">
                    <h2 class="fonte text-h6 font-weight-semibold text-black mb-3">4. Direitos de Conteúdo</h2>
                    <div class="fonte text-body-large text-grey-darken-3 mb-3">
                      O conteúdo disponível no blog da Entre Ideias, incluindo, mas não se limitando a, textos, imagens, ilustrações, designs, ícones, fotografias, programas de computador, videoclipes e áudios, constitui propriedade intelectual protegida tanto pela legislação nacional quanto por tratados internacionais sobre direitos autorais e propriedade industrial. Essa propriedade engloba não apenas materiais diretamente produzidos e publicados por nós, mas também conteúdos que são utilizados sob licença ou permissão de terceiros, garantindo que todos os direitos sejam respeitados conforme as normativas vigentes.
                    </div>
                    <div class="fonte text-body-large text-grey-darken-3">
                      Ao acessar nosso blog, você recebe uma licença limitada, não exclusiva e revogável para visualizar e usar o conteúdo para fins pessoais e não comerciais. Isso implica que qualquer reprodução, distribuição, transmissão ou modificação do conteúdo, sem a devida autorização escrita da Entre Ideias, é estritamente proibida. Tal restrição visa proteger os direitos de propriedade intelectual associados aos materiais disponibilizados, assegurando que sua utilização não infrinja os direitos dos criadores ou detentores desses direitos, além de promover um ambiente de respeito e valorização da criatividade e inovação.
                    </div>
                  </div>

                  <div class="section-block">
                    <h2 class="fonte text-h6 font-weight-semibold text-black mb-3">5. Cookies e Mais</h2>
                    <div class="fonte text-body-large text-grey-darken-3 mb-3">
                      Utilizamos cookies para melhorar sua experiência, coletando informações anônimas durante sua visita, como suas preferências de idioma, duração da visita, páginas acessadas, e outras estatísticas de uso. Esses dados nos ajudam a personalizar seu conteúdo, otimizar a navegação, melhorar continuamente o blog em design e funcionalidade, e garantir sua segurança online. Esta prática é essencial para nos permitir oferecer um serviço mais ajustado às suas necessidades e resolver qualquer problema que possa surgir mais rapidamente.
                    </div>
                    <div class="fonte text-body-large text-grey-darken-3">
                      Se você preferir limitar ou recusar o uso de cookies, a configuração pode ser ajustada através do seu navegador. Isso pode afetar a sua experiência no blog, pois algumas funcionalidades dependem dos cookies para funcionar corretamente. Entendemos a importância do controle sobre suas informações e queremos que você saiba que, ao ajustar as configurações para bloquear cookies, algumas partes do nosso blog podem não oferecer a experiência completa pretendida.
                    </div>
                  </div>

                  <div class="section-block">
                    <h2 class="fonte text-h6 font-weight-semibold text-black mb-3">6. Explorando Links Externos</h2>
                    <div class="fonte text-body-large text-grey-darken-3">
                      Nosso blog pode incluir links para sites externos que achamos que podem ser do seu interesse. Note que não temos controle sobre esses sites externos e, portanto, não somos responsáveis pelo seu conteúdo ou políticas.
                    </div>
                  </div>

                  <div class="section-block">
                    <h2 class="fonte text-h6 font-weight-semibold text-black mb-3">7. Mudanças e Atualizações</h2>
                    <div class="fonte text-body-large text-grey-darken-3 mb-3">
                      A evolução é parte de como operamos, o que significa que estes Termos de Uso podem passar por atualizações para refletir melhor as mudanças em nossos serviços ou na legislação. Sempre que isso acontecer, você encontrará a versão mais recente disponível aqui. Se as mudanças forem significativas, faremos o possível para notificá-lo através dos meios de contato que você nos forneceu.
                    </div>
                    <div class="fonte text-body-large text-grey-darken-3">
                      Continuar a acessar o blog após essas mudanças indica que você concorda com os novos termos. Se, por qualquer motivo, você não concordar com as atualizações, pedimos que não continue utilizando nosso blog e serviços.
                    </div>
                  </div>
                </div>

                <v-card elevation="0" class="pa-6 mt-8 rounded-lg" style="background-color: rgba(var(--v-theme-septenary), 0.15); border: 1px solid rgba(var(--v-theme-septenary), 0.3);">
                  <div class="text-black d-flex flex-column gap-2 text-center text-sm-left">
                    <span class="fonte text-subtitle-1 font-weight-semibold text-black">Dúvidas ou Comentários?</span>
                    <span class="fonte text-body-large text-grey-darken-4">
                      Se tiver dúvidas sobre estes termos, não hesite em nos contatar através do e-mail 
                      <a href="mailto:entreideiasvs@gmail.com" class="text-decoration-none font-weight-medium" style="color: rgb(var(--v-theme-secondary));">
                        entreideiasvs@gmail.com
                      </a>.
                    </span>
                  </div>
                </v-card>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </v-main>
  <Footer />
</template>

<script setup lang="ts">
import { navigateTo } from '#app';
import Banner from '@/components/Banner.vue';
import Footer from '@/components/Footer.vue';

// Função para navegação instantânea para a home
const voltar = () => {
  navigateTo('/');
};
</script>

<style scoped>
.fonte {
  font-family: 'Georgia', serif !important;
}

/* Garante espaçamento consistente entre os blocos de texto text-justify */
.gap-6 {
  gap: 24px !important;
}

.leading-tight {
  line-height: 1.25;
}

/* Ajustes finos para garantir que o texto justificado não fique estranho em mobile */
@media (max-width: 600px) {
  .text-justify {
    text-align: left !important;
  }
}
</style>